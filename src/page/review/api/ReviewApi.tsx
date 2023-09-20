import springAxiosInst from "utility/axiosInstance";
import { Review } from "../entity/Review";
import { ReviewImage } from "../entity/ReviewImage";

// 리뷰 등록
export const reviewRegister = async (data: {
  userToken: string;
  orderId: number;
  productOptionId: number;
  content: string;
  rating: number;
  imagesRegisterRequestList: ReviewImage[];
}): Promise<Review> => {
  const response = await springAxiosInst.post<Review>("/review/register", data);
  console.log("전송정보확인", response.data)
  return response.data;
};
