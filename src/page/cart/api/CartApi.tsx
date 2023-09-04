import axiosInstance from "utility/axiosInstance";
import { Cart } from "../entity/Cart";
import { CartItems } from "../entity/CartItems";

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

// 장바구니 목록 조회
export const getCartItemList = async () => {
  const response = await axiosInstance.springAxiosInst.get<CartItems[]>("/cart/list", {
    params: { userToken: userToken },
  });
  console.log("장바구니 리스트 데이터", response.data);
  return response.data;
};

// 장바구니 상품 수량 조절
export const changeCartItemCount = async (requestData: Cart) => {
  const data = {
    userToken: userToken,
    request: requestData,
  };
  await axiosInstance.springAxiosInst.put("/cart/change", data);
  console.log("장바구니에 데이터 전송 성공");
};
