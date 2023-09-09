import { OrderInfo } from "entity/order/OrderInfo";
import { UserAddress } from "entity/order/UserAddress";
import axiosInstance from "utility/axiosInstance";

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

// 사용자 주소 정보 수정
export const updateAddressInfo = async (updatedData: UserAddress) => {
  const { address, zipCode, addressDetail } = updatedData;
  const response = await axiosInstance.springAxiosInst.put("/order/updateInfo", {
    userToken: userToken,
    address,
    zipCode,
    addressDetail,
  });
  return response.data;
};
