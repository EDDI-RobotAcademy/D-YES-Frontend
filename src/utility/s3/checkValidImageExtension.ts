export function isValidImageExtension(fileName?: string) {
  if (!fileName) {
    return false;
  }
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const splitFile = fileName.split(".");
  if (splitFile.length < 2) {
    return false;
  }
  const fileExtension = splitFile[splitFile.length - 1].toLowerCase();

  return allowedExtensions.includes(fileExtension);
}
