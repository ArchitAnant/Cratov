// Utility to save post data (address, images, etc.) to localStorage
// images should be an array of base64 strings
export function savePostData(data) {
  localStorage.setItem('postData', JSON.stringify(data));
}

// Utility to get post data from localStorage
export function getPostData() {
  const data = localStorage.getItem('postData');
  return data ? JSON.parse(data) : null;
}

// Utility to convert File/Blob to base64 string (returns a Promise)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
