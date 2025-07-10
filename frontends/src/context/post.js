
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


// Small post Data class




//  Big post Data Class

