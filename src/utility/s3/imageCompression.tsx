import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

export const compressImgForProfile = async (image: File) => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 300,
    };
    return await imageCompression(image, options);
  } catch (e) {
    toast.error("이미지 파일을 업로드해주세요!");
    console.log(e);
    throw e;
  }
};

export const compressImg = async (image: File) => {
  try {
    const options = {
      maxSizeMB: 1,
    };
    return await imageCompression(image, options);
  } catch (e) {
    toast.error("이미지 파일을 업로드해주세요!");
    console.log(e);
    throw e;
  }
};
