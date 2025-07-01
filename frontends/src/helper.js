
const AZURE_FUNCTION_KEY = process.env.REACT_APP_AZURE_FUNCTION_KEY; // Replace with your actual Azure Function key

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1]; // remove "data:image/jpeg;base64,..."
      resolve(base64);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file); // trigger onload
  });
}
async function createImageUploadPayload(selectedFiles, userID) {

  const payload = {
    userID,
  };

  for (let i = 0; i < 4; i++) {
    const file = selectedFiles[i];
    const base64Data = await readFileAsBase64(file);

    payload[`img${i + 1}`] = {
      data: base64Data,
      name: file.name
    };
  }

  return payload;
}

async function uploadImagesToBackend(payload) {
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
  console.log("Tags found:", tagsDict);
  // count the number of SVD and DMG tags


  // accepted if there are more than 1 SVD tags or more than 2 DMG
  if (tagsDict["SVD"] > 1 || tagsDict["DMG"] > 2) {
    return 1; // Accepted
  } else {
    return 0; // Rejected
  }
}

export { createImageUploadPayload, uploadImagesToBackend, predictPotholes,checkAcceptance };
