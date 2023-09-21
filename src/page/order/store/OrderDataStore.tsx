import { create } from "zustand";
import { AdminOrderDetail } from "../entity/AdminOrderDetail";

interface OrderDataState {
  orderData: AdminOrderDetail;
  setOrderDataInfo: (orderUserInfo: AdminOrderDetail) => void;
}

export const useOrderDataStore = create<OrderDataState>((set) => ({
  orderData: {} as AdminOrderDetail,
  setOrderDataInfo: (orderData) => set({ orderData }),
}));
