import { create } from "zustand";
import { OrderInfo } from "../entity/OrderInfo";

interface OrderUserInfoState {
  orderUserInfo: OrderInfo;
  setOrderUserInfo: (orderUserInfo: OrderInfo) => void;
}

export const useOrderUserInfoStore = create<OrderUserInfoState>((set) => ({
  orderUserInfo: {} as OrderInfo,
  setOrderUserInfo: (orderUserInfo) => set({ orderUserInfo }),
}));
