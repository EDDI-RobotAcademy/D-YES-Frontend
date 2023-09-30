import { create } from "zustand";
import { InquiryReply } from "../entity/InquiryReply";

interface InquiryReplyState {
  inquiryReply: InquiryReply;
  setInquiryReply: (inquiryReply: InquiryReply) => void;
}

export const useInquiryReplyStore = create<InquiryReplyState>((set) => ({
  inquiryReply: {} as InquiryReply,
  setInquiryReply: (inquiryReply) => set({ inquiryReply }),
}));
export default useInquiryReplyStore;
