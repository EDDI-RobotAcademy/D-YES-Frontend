import { OrderInfo } from "entity/order/OrderInfo";
import { create } from "zustand";

interface OrderUserInfoState {
  orderUserInfo: OrderInfo;
  setOrderUserInfo: (orderUserInfo: OrderInfo) => void;
}

export const useOrderUserInfoState = create<OrderUserInfoState>((set) => ({
  orderUserInfo: {} as OrderInfo,
  setOrderUserInfo: (orderUserInfo) => set({ orderUserInfo }),
}));