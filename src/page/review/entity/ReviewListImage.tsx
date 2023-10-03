export interface ReviewRequestImages {
  reviewImageId: number;
  reviewImages: string;
}

export type ReviewImageName = Omit<ReviewRequestImages, "reviewImageId">;
