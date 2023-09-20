import { create } from "zustand";
import { Review } from "../entity/Review";

interface ReviewState {
  reviews: Review;
  setReviews: (reviews: Review) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: {} as Review,
  setReviews: (reviews) => set({ reviews }),
}));
export default useReviewStore;
