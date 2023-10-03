import { ReviewImageName } from "./ReviewListImage";
import { ReviewRegisterRequest } from "./ReviewRegisterForm";

export interface ReviewRegister {
  reviewRegisterRequest: ReviewRegisterRequest;
  imagesRegisterRequestList: ReviewImageName[];
}
