
export function savePostData(data) {
  localStorage.setItem('postData', JSON.stringify(data));
}


export function getPostData() {
  const data = localStorage.getItem('postData');
  return data ? JSON.parse(data) : null;
}


export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


// Small post Data class - only essential data for home page display
class SmallPost {
  constructor(postID, username, address, status, timestamp, voteCount = 0, bidStatus = "", price = "") {
    this.postID = postID;
    this.username = username;
    this.address = address;
    this.status = status;
    this.timestamp = timestamp;
    this.voteCount = voteCount;
    this.bidStatus = bidStatus;
    this.price = price;
  }
}

// Store post ID after successful submission
export function savePostId(postId) {
  localStorage.setItem('lastPostId', postId);
}

// Get the last submitted post ID
export function getLastPostId() {
  return localStorage.getItem('lastPostId');
}

// Clear post ID
export function clearPostId() {
  localStorage.removeItem('lastPostId');
}

// Store list of small posts for home page
export function saveSmallPostsList(posts) {
  const smallPosts = posts.map(post => new SmallPost(
    post.postID || post.id || `post-${Date.now()}-${Math.random()}`,
    post.username || post.userID || post.user_id || "Anonymous",
    post.address || post.landmark || post.location || "Location not specified",
    post.status || "Awaiting Approval",
    post.timestamp || post.created_at || new Date().toISOString(),
    post.voteCount || post.vote_count || post.votes || 0,
    post.bidStatus || post.bid_status || "",
    post.price || post.amount || ""
  ));

  localStorage.setItem('smallPostsList', JSON.stringify(smallPosts));
}

// Get list of small posts
export function getSmallPostsList() {
  const posts = localStorage.getItem('smallPostsList');
  return posts ? JSON.parse(posts) : [];
}

// Add new small post to existing list
export function addSmallPost(postData) {
  const existingPosts = getSmallPostsList();
  const newPost = new SmallPost(
    postData.postID,
    postData.username,
    postData.address,
    postData.status,
    postData.timestamp || new Date().toISOString(),
    postData.voteCount || 0,
    postData.bidStatus || "",
    postData.price || ""
  );

  // Add to beginning of array (newest first)
  const updatedPosts = [newPost, ...existingPosts];

  // Remove duplicates based on postID
  const uniquePosts = updatedPosts.filter((post, index, self) =>
    index === self.findIndex(p => p.postID === post.postID)
  );

  localStorage.setItem('smallPostsList', JSON.stringify(uniquePosts));
  return uniquePosts;
}

// Legacy functions for backward compatibility
export function savePostsList(posts) {
  saveSmallPostsList(posts);
}

export function getPostsList() {
  return getSmallPostsList();
}

