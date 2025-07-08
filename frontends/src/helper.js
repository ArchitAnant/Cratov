import imageCompression from 'browser-image-compression';
import { BrowserProvider } from "ethers";

const AZURE_FUNCTION_KEY = process.env.REACT_APP_AZURE_FUNCTION_KEY; // Replace with your actual Azure Function key


async function compressAndConvertToBase64(file) {
  if (!file) throw new Error("No file provided");

  const options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    initialQuality: 0.8,
  };

  const compressedFile = await imageCompression(file, options);

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result;
      // remove the 'data:image/jpeg;base64,' prefix
      const base64 = result.split(',')[1] || "";
      resolve({ base64, name: file.name });
    };
    reader.onerror = reject;
    reader.readAsDataURL(compressedFile);
  });
}


async function createImageUploadPayload(selectedFiles, userID, landmark, coordinates) {
  if (!Array.isArray(selectedFiles) || selectedFiles.length < 4) {
    throw new Error("Expected 4 image files");
  }

  const compressedImages = await Promise.all(
    selectedFiles.slice(0, 4).map((file) => compressAndConvertToBase64(file))
  );

  const payload = {
    userID: userID ?? "unknown_user",
    landmark: landmark ?? "Unknown",
    coordinates: coordinates ?? "0,0",
  };

  compressedImages.forEach(({ base64, name }, i) => {
    payload[`img${i + 1}`] = {
      data: base64,  // ✅ exactly what Python backend expects
      name: name
    };
  });

  return payload;
}



async function uploadPostToBackend(payload) {
  const azureUrl = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/uploadpost?code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

// async function to predcit potholes using endpoint https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/predictpothole?postid=POSTID&code=AZURE_FUNCTION_KEY
async function predictPotholes(postID) {
  const azureUrl = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/predictpothole?postid=${postID}&code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(azureUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error('Error predicting potholes:', error);
    throw error;
  }
}

function checkAcceptance(response) {
  // make a empty string array
  const tagsDict = {
    "SVD" : 0,
    "DMG" : 0,
    "ACPT" : 0,
    "NML" : 0
  };
  for (const key in response) {
    if (response.hasOwnProperty(key)) {
      const tag = response[key].pdt_tag;
      if (tag) {
        if (tagsDict.hasOwnProperty(tag)) {
          tagsDict[tag] += 1;
        } else {
          console.warn(`Unknown tag: ${tag}`);
        }
      }
    }
  }
  // count the number of SVD and DMG tags


  // accepted if there are more than 1 SVD tags or more than 2 DMG
  if (tagsDict["SVD"] > 1 || tagsDict["DMG"] > 2) {
    return 1; // Accepted
  } else {
    return 0; // Rejected
  }
}


async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new BrowserProvider(window.ethereum); 
    const signer = await provider.getSigner();            
    const userAddress = await signer.getAddress();

    return { provider, signer, userAddress };
  } catch (err) {
    if (err.code === 4001) {
      alert("You rejected the MetaMask connection request.");
    } else {
      console.error(err);
      alert("Error connecting to MetaMask: " + err.message);
    }
    return null;
  }
}

async function checkAlredyRegisted(address){
  return false;
}

async function registerNewUser(address, userName, userType, userUsername) {
  // wait for 2 seconds to simulate a delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return true;
}

async function checkUsername(username) {
  // Simulate an API call to check if the username is available
  // In a real application, you would replace this with an actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, let's assume all usernames are available
  return true;
}

export { createImageUploadPayload, uploadPostToBackend, predictPotholes,checkAcceptance,connectWallet,checkAlredyRegisted,registerNewUser,checkUsername };
