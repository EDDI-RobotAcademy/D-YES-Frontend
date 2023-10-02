import { OrderInfo } from "../entity/OrderInfo";
import axiosInstance from "utility/axiosInstance";
import { UserOrderList } from "../entity/UserOrderList";
import { OrderInfoResponse } from "../entity/OrderInfoResponse";
import { OrderStatisticsResponse } from "../entity/OrderStatisticsResponse";
import { AdminReason } from "../entity/AdminReason";
import { AdminRefund } from "../entity/AdminRefund";
import { RefundPopup } from "../entity/RefundPopup";

const userToken = localStorage.getItem("userToken");

// 주문 전 확인 정보 요청
export const getOrderInfo = async (requestData: number[]) => {
  const requestForm = {
    userToken: userToken,
    requestList: requestData,
  };
  const response = await axiosInstance.post<OrderInfo>("/order/confirm", requestForm);
  console.log("주문 확인 데이터", response.data);
  return response.data;
};

// 사용자의 주문 목록 조회
export const getUserOrderList = async () => {
  const response = await axiosInstance.get<UserOrderList[]>("order/my-list", {
    params: { userToken: userToken },
  });
  console.log("사용자 주문 목록 데이터", response.data);
  return response.data;
};

// 관리자용 신규 주문 리스트 확인
export const fetchNewOrderList = async (): Promise<OrderInfoResponse> => {
  const response = await axiosInstance.get<OrderInfoResponse>("/order/admin/new-list");
  console.log("신규 주문 리스트 데이터", response.data);
  return response.data;
};

// 관리자용 당월 주문 통계 데이터 확인
export const monthlyOrderStatistics = async (): Promise<OrderStatisticsResponse> => {
  const response = await axiosInstance.get<OrderStatisticsResponse>("/order/admin/monthly_orders");
  console.log("당월 주문 통계 데이터", response.data);
  return response.data;
};

// 관리자 환불 목록
export const getRefundList = async () => {
  const response = await axiosInstance.get("/order/admin/refund-list");
  console.log("받은 데이터", response.data);
  return response.data;
};

// 관리자 환불
export const changeRefundStatus = async (data: {
  orderAndTokenAndReasonRequest: AdminReason;
  requestList: { productOptionId: number }[];
}): Promise<AdminRefund> => {
  const response = await axiosInstance.post<AdminRefund>("/order/payment/kakao/refund", data);
  return response.data;
};

// 관리자 환불 팝업
export const fetchPopupRefund = async (
  productOrderId: string
): Promise<RefundPopup | null> => {
  const response = await axiosInstance.get<RefundPopup>(
    `/order/admin/refund/read/${productOrderId}`
  );
  return response.data;
};
