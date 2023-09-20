import { create } from "zustand";
import { ReviewImage } from "../entity/ReviewImage";

interface ReviewImageState {
  reviewImages: ReviewImage[];
  setReviewImages: (reviewImages: ReviewImage[]) => void;
}

export const useReviewImageStore = create<ReviewImageState>((set) => ({
    reviewImages: [],
    setReviewImages: (reviewImages) => set({ reviewImages }),
}));
export default useReviewImageStore;
