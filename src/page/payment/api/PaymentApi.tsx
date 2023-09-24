import { OrderRefund } from "page/order/entity/OrderRefund";
import { OrderRequset } from "page/order/entity/OrderRequset";
import axiosInstance from "utility/axiosInstance";

const userToken = localStorage.getItem("userToken");

// 상품 결제
export const orderRequest = async (requsetData: OrderRequset) => {
  const data = {
    userToken: userToken,
    orderedPurchaserProfileRequest: requsetData.orderedUserInfo,
    orderedProductOptionRequestList: requsetData.orderedProductInfo,
    totalAmount: requsetData.totalAmount,
    from: requsetData.from,
  };
  const response = await axiosInstance.post<string>("/order/payment/kakao", data);
  window.location.href = response.data;
  return !!response.data;
};

// 카카오 결제 확정
export const kakaoPaymentApprovalRequest = async (pgToken: string) => {
  const requestForm = {
    userToken: userToken,
    pg_token: pgToken,
  };
  const response = await axiosInstance.post<boolean>("/order/payment/kakao/approve", requestForm);
  console.log("결제 확인 데이터", response.data);
  return response.data;
};

// 카카오 결제 취소 및 실패
export const kakaoPaymentRejectRequest = async () => {
  const response = await axiosInstance.delete<boolean>("/order/payment/kakao/reject", {
    data: {
      userToken: userToken,
    },
  });
  return response.data;
};

// 카카오 상품 환불
export const refundOrderedItems = async (refundItems: OrderRefund) => {
  const requestForm = {
    userToken: userToken,
    requestList: refundItems,
  };
  const response = await axiosInstance.post<boolean>("/order/payment/kakao/refund", requestForm);
  console.log("환불 데이터", requestForm);
  return response.data;
};
