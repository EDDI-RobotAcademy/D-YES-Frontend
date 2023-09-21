import { Review } from "../entity/Review";
import { ReviewImage } from "../entity/ReviewImage";
import axiosInstance from "utility/axiosInstance";
import { ReviewRequestResponseForm } from "../entity/ReviewList";

// 리뷰 등록
export const reviewRegister = async (data: {
  userToken: string;
  orderId: number;
  productOptionId: number;
  content: string;
  rating: number;
  imagesRegisterRequestList: ReviewImage[];
}): Promise<Review> => {
  const response = await axiosInstance.post<Review>("/review/register", data);
  console.log("전송정보확인", response.data);
  return response.data;
};

// 리뷰 리스트 요청
export const getReviewList = async (productId: string) => {
  const response = await axiosInstance.get<ReviewRequestResponseForm[]>(
    `/review/list/${productId}`
  );
  console.log("리뷰 리스트 데이터", response.data);
  return response.data;
};
