import imageCompression from "browser-image-compression";

export const compressImg = async (image: File) => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 300,
    };
    return await imageCompression(image, options);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
