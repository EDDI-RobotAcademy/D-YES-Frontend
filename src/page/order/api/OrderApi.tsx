import { OrderInfo } from "../entity/OrderInfo";
import { OrderRequset } from "../entity/OrderRequset";
import axiosInstance from "utility/axiosInstance";

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

// 장바구니에 있는 상품 주문
export const orderRequestInCart = async (requsetData: OrderRequset) => {
  const data = {
    userToken: userToken,
    orderedPurchaserProfileRequest: requsetData.orderedUserInfo,
    orderedProductOptionRequestList: requsetData.orderedProductInfo,
    totalAmount: requsetData.totalAmount,
    from: requsetData.from,
  };
  console.log("주문 요청 성공", data);
  // const response = await axiosInstance.post("/order/payment/kakao", data);
  // console.log("주문 데이터 전송 성공");
  // return response.data;
};
