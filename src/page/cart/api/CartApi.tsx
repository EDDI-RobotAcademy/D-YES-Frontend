import { Cart } from "entity/cart/Cart";
import { CartItems } from "entity/cart/CartItems";
import axiosInstance from "utility/axiosInstance";

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
  const response = await axiosInstance.springAxiosInst.put("/cart/change", data);
  console.log("장바구니에 데이터 전송 성공", response.data);
  return response.data;
};

// 장바구니 상품 삭제
export const deleteCartItems = async (optionIds: number[]) => {
  try {
    const requestData = optionIds.map((optionId) => ({
      userToken: userToken,
      productOptionId: optionId,
    }));

    await axiosInstance.springAxiosInst.delete("/cart/delete", {
      data: requestData,
    });
    console.log("장바구니 상품 삭제 요청 성공");
  } catch (error) {
    console.error("상품 삭제 요청 실패", error);
  }
};
