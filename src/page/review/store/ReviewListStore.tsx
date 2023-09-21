import { create } from "zustand";
import { ReviewRequestResponseForm } from "../entity/ReviewList";

interface ReviewInfoState {
  reviewInfo: ReviewRequestResponseForm[];
  setReviewInfo: (reviewInfo: ReviewRequestResponseForm[]) => void;
}

export const useReviewInfoStore = create<ReviewInfoState>((set) => ({
  reviewInfo: {} as ReviewRequestResponseForm[],
  setReviewInfo: (reviewInfo) => set({ reviewInfo }),
}));
