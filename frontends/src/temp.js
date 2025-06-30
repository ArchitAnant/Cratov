const { BlobServiceClient } = require("@azure/storage-blob");
const { TableClient } = require("@azure/data-tables");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Load environment variables
const CONNECTION_STRING = process.env.BLOB_STORAGE_CONNECTION_STRING;
const AZURE_FUNCTION_KEY = process.env.AZURE_FUNCTION_KEY;

// Utility: Generate Post ID
function generatePostId(userId) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:]/g, '').slice(0, 14); // "YYYYMMDDHHMMSS"
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `post_${userId}_${timestamp}_${randomNumber}`;
}

// Utility: Generate Image Blob Name
function generateImageId(userId) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:]/g, '').slice(0, 8) + '_' +
                      now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `img_${userId}_${timestamp}_${randomNumber}.jpg`;
}

// Utility: Get MIME Type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png"
    };
    return map[ext] || "application/octet-stream";
}

// Step 1: Upload Images to Azure Blob
async function uploadToAzureBlob(filePaths, userId) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("images");
    await containerClient.createIfNotExists();

    const uploadedNames = [];

    for (const filePath of filePaths) {
        const newBlobName = generateImageId(userId);
        const blobClient = containerClient.getBlockBlobClient(newBlobName);
        const fileStream = fs.createReadStream(filePath);

        await blobClient.uploadStream(fileStream, undefined, undefined, {
            blobHTTPHeaders: { blobContentType: getMimeType(filePath) }
        });

        console.log(` Uploaded: ${newBlobName}`);
        uploadedNames.push(newBlobName);
    }

    return uploadedNames;
}

// Step 2: Upload Post Info to Azure Table
async function uploadPostToTable(imageBlobNames, userId, tableName) {
    if (imageBlobNames.length !== 4) {
        throw new Error("Exactly 4 image blob names are required");
    }

    const postId = generatePostId(userId);
    const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, tableName);
    await tableClient.createTable();

    const roles = ["front", "left", "right", "top"];
    const timestamp = new Date().toISOString();

    for (let i = 0; i < imageBlobNames.length; i++) {
        const entity = {
            partitionKey: postId,
            rowKey: roles[i],
            userId: userId,
            image_id: imageBlobNames[i],
            uploadedAt: timestamp
        };

        await tableClient.upsertEntity(entity);
        console.log(` Table Entity Added: ${roles[i]} - ${imageBlobNames[i]}`);
    }

    return postId;
}

// Step 3: Azure Function Prediction API Call
async function requestPotholePrediction(postId) {
    const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/predictPothole?postid=${postId}&code=${AZURE_FUNCTION_KEY}`;

    try {
        const response = await axios.post(url, {}, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(" Prediction Result:", response.data);
        return response.data;

    } catch (err) {
        console.error(" Prediction API Error:", err.response?.data || err.message);
        throw err;
    }
}

// Step 4: Delete Blobs from Azure
async function deleteBlobFromAzure(blobName, containerName, connectionString) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blobClient.deleteIfExists();
        console.log(` Deleted blob: ${blobName}`);
    } catch (error) {
        console.error(` Blob delete failed (${blobName}):`, error.message);
    }
}

// Step 5: Delete Post from Table
async function deletePostFromTable(postId, tableName) {
    const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, tableName);

    try {
        const entities = tableClient.listEntities({
            queryOptions: { filter: `PartitionKey eq '${postId}'` }
        });

        for await (const entity of entities) {
            await tableClient.deleteEntity(entity.partitionKey, entity.rowKey);
            console.log(` Deleted Table Entity: ${entity.rowKey}`);
        }

        console.log(` Deleted all records for Post ID: ${postId}`);

    } catch (error) {
        console.error(` Table delete failed for Post ID '${postId}':`, error.message);
    }
}

// Step 6: Upload Handler (UI Step 1)
async function handleUpload(filePaths, userId, tableName) {
    try {
        const uploadedNames = await uploadToAzureBlob(filePaths, userId);

        if (!uploadedNames || uploadedNames.length !== filePaths.length) {
            throw new Error('Image upload failed or incomplete');
        }

        const postId = await uploadPostToTable(uploadedNames, userId, tableName);
        console.log(` Upload Success. Post ID: ${postId}`);
        return postId;

    } catch (error) {
        console.error(" Upload Handling Failed:", error.message);
        throw error;
    }
}

// Step 7: Prediction Handler (UI Step 2)
async function handlePrediction(postId) {
    try {
        const prediction = await requestPotholePrediction(postId);
        console.log(` Prediction for Post ID ${postId}:`, prediction);
        return prediction;
    } catch (error) {
        console.error(` Prediction failed for Post ID ${postId}:`, error.message);
        throw error;
    }
}

// Step 8: Cleanup Handler (For Rejected cases or error rollback)
async function handleCleanup(postId, uploadedNames, tableName) {
    try {
        for (const blobName of uploadedNames) {
            await deleteBlobFromAzure(blobName, 'images', CONNECTION_STRING);
        }
        await deletePostFromTable(postId, tableName);
        console.log(` Cleanup done for Post ID: ${postId}`);
    } catch (error) {
        console.error(` Cleanup failed for Post ID '${postId}':`, error.message);
    }
}

// Step 9: Full Upload + Prediction + Status Flow (Optional - One-Shot Mode)
async function verifyAndProcessPothole(filePaths, userId, tableName) {
    const uploadedNames = await uploadToAzureBlob(filePaths, userId);

    if (!uploadedNames || uploadedNames.length !== filePaths.length) {
        throw new Error('Image upload failed or incomplete');
    }

    const postId = await uploadPostToTable(uploadedNames, userId, tableName);

    let prediction;
    try {
        prediction = await requestPotholePrediction(postId);
    } catch (error) {
        await handleCleanup(postId, uploadedNames, tableName);
        throw error;
    }

    let svdCount = 0, dmgCount = 0;
    for (const key in prediction) {
        const tag = prediction[key]?.pdt_tag;
        if (tag === 'SVD') svdCount++;
        if (tag === 'DMG') dmgCount++;
    }

    let status;
    if (svdCount > 1 || dmgCount > 2) {
        status = 'Accepted';
    } else {
        status = 'Rejected';
        await handleCleanup(postId, uploadedNames, tableName);
    }

    console.log(` Post ID ${postId} is ${status}`);
    return status;
}

// Export Clean Modular Functions
module.exports = {
    handleUpload,
    handlePrediction,
    handleCleanup,
    verifyAndProcessPothole
};
