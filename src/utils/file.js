export const generateFileObjectFromBase64 = (base64, fileName) => {
  const arr = base64.split(',');
  const decodedData = atob(arr[1]);
  const len = decodedData.length;
  let bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = decodedData.charCodeAt(i);
  }

  const fileObject = new File([bytes], fileName, { type: 'image/png' });

  const reader = new FileReader();
  reader.readAsDataURL(fileObject);

  return fileObject;
};

export const downloadFileFromBlob = (blob, fileName) => {
  const objectURL = window.URL.createObjectURL(blob);
  let link = document.createElement('a');

  link.setAttribute('href', objectURL);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);

  link.click();

  link.remove();
  window.URL.revokeObjectUrl(objectURL);
};
