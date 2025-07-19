import imageCompression from 'browser-image-compression';
import { BrowserProvider } from "ethers";

const AZURE_FUNCTION_KEY = process.env.REACT_APP_AZURE_FUNCTION_KEY; // Replace with your actual Azure Function key


function formatIndianNumber(inputStr) {
  const num = parseFloat(inputStr);
  if (isNaN(num)) return "Invalid number";

  if (num >= 1e7) {
    return (num / 1e7).toFixed(2) + " Cr";
  } else if (num >= 1e5) {
    return (num / 1e5).toFixed(2) + " Lakh";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + " Ths";
  } else {
    return num.toString();
  }
}

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
    throw error;
  }
}

async function deletePost(postID) {
  const url = `http://localhost:7071/api/deletePost?postid=${postID}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting post:', error);
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
    const mainTag = tagsDict["SVD"] > 1 ? "Sevearly Damaged" : "Damaged";
    return [1,mainTag]; // Accepted
  } else {
    return [0,""]; // Rejected
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

async function checkAlredyRegisted(address,setUserType){
  
  
  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/checkregister?address=${address}&code=${AZURE_FUNCTION_KEY}`;

  try{
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    setUserType(data.role); // Assuming the API returns { registered: true/false, role: "user"/"agency"/"contractor" }
    return data.registered; // Assuming the API returns { isRegistered: true/false }
  }
  catch (error) {
    throw error;
  }
}


async function registerNewUser(address, userName, userType, userUsername) {
  // wait for 2 seconds to simulate a delay
  const payload = {
    address: address,
    userName: userName,
    role: userType,
    userUsername: userUsername
  };

  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/register?code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await response.json();

    if (resp.success) {
      return true;
    }
    else {
      var errorMessage = resp.message || "Unknown error occurred";

      if (errorMessage === "DUP_REG"){
        alert("Username already exists. Please choose a different username.");
        // errorMessage = "Username already exists. Please choose a different username.";
      }
      else if (errorMessage === "INV_ROLE"){
        alert("Invalid user type. Please select either a valid role.");
        // errorMessage = "Invalid user type. Please select either a valid role.";
      }
      else{
        alert("An error occurred while registering the user. Please try again later.");
        // errorMessage = "An error occurred while registering the user. Please try again later.";
      }
      console.error("User registration failed:", resp);
      return false;
    }
     // Assuming the API returns { success: true/false }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

async function getUserDetails(address,userType) {
  const payload = {
    address : address,
    role : userType
  }
  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/fetchuserdetails?code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Assuming the API returns user details
  } catch (error) {
    throw error;
  }
  
}

async function getPostList(){
  const azureUrl = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/fetch_post?code=${AZURE_FUNCTION_KEY}`;



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

    const data = await response.json();

    // Convert backend data to frontend format
    const dataWithIds = data.map((post, index) => ({
      ...post,
      postID: post.post_id || post.postID || post.id || `backend-${Date.now()}-${index}`,
      address: post.landmark || post.address || "Location not specified",
      status: post.post_condition || post.status || "Awaiting Approval",
      timestamp: post.uploaded_at || post.timestamp || post.created_at || new Date().toISOString(),
      voteCount: post.vote_count || post.voteCount || 0,
      bidStatus: post.post_condition || post.bidStatus || "",
      price: post.price || post.amount || "",
      coordinates: post.coordinates
  ? {
      lat: parseFloat(post.coordinates.split(",")[0]),
      lon: parseFloat(post.coordinates.split(",")[1]),
    }
  : {
      lat: 22.5726,
      lon: 88.3639,
    }
    }));

    return dataWithIds;

  } catch (error) {
    return [];
  }
}

async function addRoadCondition(postID, roadCondition){
  const payload = {
    postID: postID,
    roadCondition: roadCondition
  };

  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/addroadcondition?code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error adding road condition:', error);
    throw error;
  }

}

async function updatePostCondition(postID, postCondition) {
  const payload = {
    postID: postID,
    condition: postCondition
  };

  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/updatepostcondition?code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }

  } catch (error) {
    console.error('Error updating road condition:', error);
    throw error;
  }
}

async function fetchImageData(postID) {
  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/fetchimages?postid=${postID}&code=${AZURE_FUNCTION_KEY}`;
  const images = {};
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Convert all base64 values into proper data URLs
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        // Detect MIME type from filename (optional improvement)
        let mimeType = "image/png"; // default
        if (key.endsWith(".jpg") || key.endsWith(".jpeg")) mimeType = "image/jpeg";
        else if (key.endsWith(".webp")) mimeType = "image/webp";
        else if (key.endsWith(".gif")) mimeType = "image/gif";
        else if (key.endsWith(".svg")) mimeType = "image/svg+xml";

        // Wrap base64 string in data URI
        images[key] = `data:${mimeType};base64,${value}`;
      }
    }

    return images;
  } catch (error) {
    console.error('Error fetching image data:', error);
    return {};
  }
}

async function uploadApprovalData(payload) {
  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/uploadpostmetadata?code=${AZURE_FUNCTION_KEY}`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log(response)
    if (response.status === 200) {
      return { success: true }; 
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading approval data:', error);
    throw error;
  }
  
}

async function getReport(postid) {
  const url = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/generatereport?postid=${postid}&code=${AZURE_FUNCTION_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // get the report_md from the response
    const data = await response.json();
    if (!data || !data.report_md) {
      throw new Error("No report data found");
    } 
    return data; // Assuming the API returns { report_md: "..." }
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
  
}



export { createImageUploadPayload, uploadPostToBackend, predictPotholes,checkAcceptance,
  connectWallet,checkAlredyRegisted,registerNewUser,getUserDetails,addRoadCondition,updatePostCondition,getPostList,fetchImageData,
uploadApprovalData ,getReport,formatIndianNumber,deletePost};
