import { ReviewRequest } from "./ReviewRequest";
import { ReviewRequestImages } from "./ReviewListImage";

export interface ReviewRequestResponseForm {
  reviewRequestResponse: ReviewRequest;
  imagesResponseList: ReviewRequestImages[];
}
