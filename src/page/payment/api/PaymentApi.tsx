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
