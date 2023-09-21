import { create } from "zustand";
import { AdminOrderProfile } from "../entity/AdminOrderProfile";

interface OrderProfileDataState {
  orderProfileData: AdminOrderProfile;
  setOrderProfileDataInfo: (orderUserInfo: AdminOrderProfile) => void;
}

export const useOrderProfileDataStore = create<OrderProfileDataState>((set) => ({
  orderProfileData: {} as AdminOrderProfile,
  setOrderProfileDataInfo: (orderProfileData) => set({ orderProfileData }),
}));
