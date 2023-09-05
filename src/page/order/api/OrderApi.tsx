import axiosInstance from "utility/axiosInstance";
import { OrderInfo } from "../entity/OrderInfo";

const userToken = localStorage.getItem("userToken");

// 주문 전 확인 정보 요청
export const getOrderInfo = async () => {
  const response = await axiosInstance.springAxiosInst.get<OrderInfo>("/order/confirm", {
    params: {
      userToken: userToken,
    },
  });
  console.log("주문 확인 데이터", response.data);
  return response.data;
};
