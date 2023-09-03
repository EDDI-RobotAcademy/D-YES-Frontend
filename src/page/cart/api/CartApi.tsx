import axiosInstance from "utility/axiosInstance";
import { Cart } from "../entity/Cart";

const userToken: string = localStorage.getItem("userToken") || "";

// 장바구니에 상품 추가
export const sendCartContainRequest = async (requestData: Cart) => {
  const data = {
    userToken: userToken,
    request: requestData,
  };
  await axiosInstance.springAxiosInst.post("/cart/contain", data);
  console.log("장바구니에 데이터 전송 성공");
};
