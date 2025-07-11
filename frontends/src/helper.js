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

async function checkAlredyRegisted(address, setUserType, setUserName, setUserUsername){
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

    if (data.registered) {
      setUserType(data.role);

      // Fetch user details if registered
      try {
        const userDetails = await getUserDetails(address, data.role);
        if (userDetails.success) {
          setUserName(userDetails.userName);
          setUserUsername(userDetails.userUsername);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    return data.registered;
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
      status: post.road_condition || post.status || "Awaiting Approval",
      timestamp: post.uploaded_at || post.timestamp || post.created_at || new Date().toISOString(),
      voteCount: post.vote_count || post.voteCount || 0,
      bidStatus: post.bid_status || post.bidStatus || "",
      price: post.price || post.amount || ""
    }));

    return dataWithIds;

  } catch (error) {
    return [];
  }
}




export { createImageUploadPayload, uploadPostToBackend, predictPotholes,checkAcceptance,connectWallet,checkAlredyRegisted,registerNewUser,getUserDetails,getPostList };
