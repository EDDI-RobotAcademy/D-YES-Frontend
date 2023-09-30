import { Inquiry } from "../entity/Inquiry";
import axiosInstance from "utility/axiosInstance";
import { InquiryDetail } from "../entity/InquiryDetail";
import { InquiryReply } from "../entity/InquiryReply";

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

// 관리자의 문의 읽기
export const getInquiryDetail = async (inquiryId: string) => {
  const response = await axiosInstance.get<InquiryDetail>(
    `/inquiry/read/${inquiryId}`
  );
  return response.data;
};

// 관리자의 문의 답변 등록
export const inquiryReplyRegister = async (data: {
  inquiryReplyRequest: InquiryReply;
}): Promise<InquiryReply> => {
  const response = await axiosInstance.post<InquiryReply>(
    "/inquiry/reply",
    data
  );
  return response.data;
};
