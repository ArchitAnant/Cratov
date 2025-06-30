const { BlobServiceClient } = require("@azure/storage-blob");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const fs = require("fs");
const path = require("path");
const axios = require('axios');

// Fix: Use correct env variable for Azure Blob Storage
const CONNECTION_STRING = process.env.BLOB_STORAGE_CONNECTION_STRING;
const AZURE_FUNCTION_KEY = process.env.AZURE_FUNCTION_KEY;

function generatePostId(userId) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:]/g, '').slice(0, 14); // "YYYYMMDDHHMMSS"
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `post_${userId}_${timestamp}_${randomNumber}`;
}

function generateImageId(userId) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:]/g, '').slice(0, 8) + '_' +
                      now.toTimeString().slice(0, 8).replace(/:/g, ''); // "YYYYMMDD_HHMMSS"
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `img_${userId}_${timestamp}_${randomNumber}.jpg`;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
  };
  return map[ext] || "application/octet-stream";
}

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
      blobHTTPHeaders: { blobContentType: getMimeType(filePath) },
    });

    console.log(` Uploaded: ${newBlobName}`);
    uploadedNames.push(newBlobName);
  }

  return uploadedNames;
}

async function deleteBlobFromAzure(blobName, containerName, connectionString) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blobClient.deleteIfExists();
    console.log(` Deleted blob: ${blobName}`);
    return true;
  } catch (error) {
    console.error(` Failed to delete blob '${blobName}':`, error.message);
    return false;
  }
}

async function uploadPostToTable(imageBlobNames, userId, tableName) {
  if (imageBlobNames.length !== 4) {
    throw new Error("Exactly 4 image blob names are required");
  }

  const postId = generatePostId(userId);
  const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, tableName);

  await tableClient.createTable(); // Safe if already exists

  const roles = ["front", "left", "right", "top"];
  const timestamp = new Date().toISOString();

  for (let i = 0; i < imageBlobNames.length; i++) {
    const entity = {
      partitionKey: postId,
      rowKey: roles[i],         // This allows you to query individually: front, left, etc.
      userId: userId,
      image_id: imageBlobNames[i],
      uploadedAt: timestamp
    };

    await tableClient.upsertEntity(entity);
    console.log(` Uploaded ${roles[i]} image to Table: ${imageBlobNames[i]}`);
  }

  console.log(` Post '${postId}' uploaded with 4 individual image records`);
  return postId;
}

async function requestPotholePrediction(postId) {
  // Fix: Use correct query param name for Azure Function
  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/predictPothole?postid=${postId}&code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await axios.post(url, {}, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(" Prediction result:", response.data);
    return response.data;
  } catch (err) {
    console.error(" Request failed:", err.response?.data || err.message);
    throw err;
  }
}

async function deletePostFromTable(postId, tableName) {
  const tableClient = TableClient.fromConnectionString(CONNECTION_STRING, tableName);

  try {
    const entities = tableClient.listEntities({
      queryOptions: {
        filter: `PartitionKey eq '${postId}'`
      }
    });

    let found = false;

    for await (const entity of entities) {
      found = true;
      await tableClient.deleteEntity(entity.partitionKey, entity.rowKey);
      console.log(`🗑️ Deleted entity [${entity.partitionKey} - ${entity.rowKey}]`);
    }

    if (!found) {
      console.log(` No entities found for post ID '${postId}'`);
    } else {
      console.log(` Deleted all entries for post ID '${postId}'`);
    }
  } catch (err) {
    console.error(` Failed to delete entities for post '${postId}':`, err.message);
  }
}

/**
 * Complete pothole verification flow as per UI Integration #2
 * @param {string[]} filePaths - Local file paths of images to upload
 * @param {string} userId - User ID
 * @param {string} tableName - Azure Table name
 * @returns {Promise<'Accepted'|'Rejected'>}
 */
async function verifyAndProcessPothole(filePaths, userId, tableName) {
  // 1. Upload images to Azure Blob Storage
  const uploadedNames = await uploadToAzureBlob(filePaths, userId);

  // 2. Check if upload is complete (length check)
  if (!uploadedNames || uploadedNames.length !== filePaths.length) {
    throw new Error('Image upload failed or incomplete');
  }

  // 3. Upload the post to Table
  let postId;
  try {
    postId = await uploadPostToTable(uploadedNames, userId, tableName);
  } catch (err) {
    // Clean up blobs if table upload fails
    for (const blobName of uploadedNames) {
      await deleteBlobFromAzure(blobName, 'images', CONNECTION_STRING);
    }
    throw err;
  }

  // 4. Call prediction API
  let predictionJson;
  try {
    predictionJson = await requestPotholePrediction(postId);
  } catch (err) {
    // Clean up everything if prediction fails
    for (const blobName of uploadedNames) {
      await deleteBlobFromAzure(blobName, 'images', CONNECTION_STRING);
    }
    await deletePostFromTable(postId, tableName);
    throw err;
  }

  // 5. Check results
  let svdCount = 0, dmgCount = 0;
  for (const key in predictionJson) {
    const tag = predictionJson[key]?.pdt_tag;
    if (tag === 'SVD') svdCount++;
    if (tag === 'DMG') dmgCount++;
  }

  let status;
  if (svdCount > 1 || dmgCount > 2) {
    status = 'Accepted';
    // (Skip: add post to user)
  } else {
    status = 'Rejected';
    // Delete blobs and post
    for (const blobName of uploadedNames) {
      await deleteBlobFromAzure(blobName, 'images', CONNECTION_STRING);
    }
    await deletePostFromTable(postId, tableName);
  }

  return status;
}

module.exports = { verifyAndProcessPothole };