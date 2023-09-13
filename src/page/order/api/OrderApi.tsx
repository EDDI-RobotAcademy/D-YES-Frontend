import { OrderInfo } from "entity/order/OrderInfo";
import { OrderRequset } from "entity/order/OrderRequset";
import { UseQueryResult, useQuery } from "react-query";
import { useOrderUserInfoStore } from "store/order/OrderStore";
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

export const useOrderInfoQuery = (): UseQueryResult<OrderInfo, unknown> => {
  const setOrderInfo = useOrderUserInfoStore((state) => state.setOrderUserInfo);
  const queryResult: UseQueryResult<OrderInfo, unknown> = useQuery("orderUserInfo", getOrderInfo, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setOrderInfo(data);
    },
  });

  console.log(queryResult);
  return queryResult;
};

export const orderRequestInCart = async (requsetData: OrderRequset) => {
  const data = {
    userToken: userToken,
    orderedPurchaserProfileRequest: requsetData.orderedUserInfo,
    orderedProductOptionRequestList: requsetData.orderedProductInfo,
    totalAmount: requsetData.totalAmount,
  };
  const response = await axiosInstance.springAxiosInst.post("/order/in-cart", data);
  console.log("주문 데이터 전송 성공");
  return response.data;
};
