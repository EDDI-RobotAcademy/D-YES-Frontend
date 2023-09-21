import { create } from "zustand";
import { AdminPayment } from "../entity/AdminPayment";

interface paymentDataState {
  paymentData: AdminPayment;
  setPaymentDataInfo: (orderUserInfo: AdminPayment) => void;
}

export const usePaymentDataStore = create<paymentDataState>((set) => ({
  paymentData: {} as AdminPayment,
  setPaymentDataInfo: (paymentData) => set({ paymentData }),
}));
