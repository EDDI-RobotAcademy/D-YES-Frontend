import { create } from "zustand";
import { AdminProductData } from "../entity/AdminProductData";

interface OrderOptionDataState {
  orderOptionData: AdminProductData[];
  setOrderOptionDataInfo: (orderUserInfo: AdminProductData[]) => void;
}

export const useOrderOptionDataStore = create<OrderOptionDataState>((set) => ({
  orderOptionData: [],
  setOrderOptionDataInfo: (orderOptionData) => set({ orderOptionData }),
}));
