import { Inquiry } from "../entity/Inquiry";
import axiosInstance from "utility/axiosInstance";
import { InquiryRegisterRequest } from "../entity/InquiryRegisterRequest";

// 문의 등록
export const inquiryRegister = async (data: {
  inquiryRegisterRequest: Inquiry;
}): Promise<Inquiry> => {
  console.log("등록 문의 정보: ", data);
  const response = await axiosInstance.post<Inquiry>("/inquiry/register", data);
  return response.data;
};

// 관리자의 문의 조회
export const getInquiryList = async () => {
  const response = await axiosInstance.get("/inquiry/list");
  return response.data;
};
