import { create } from "zustand";
import { Inquiry } from "../entity/Inquiry";

interface InquiryState {
  inquiry: Inquiry;
  setInquiry: (inquiry: Inquiry) => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  inquiry: {} as Inquiry,
  setInquiry: (inquiry) => set({ inquiry }),
}));
export default useInquiryStore;
