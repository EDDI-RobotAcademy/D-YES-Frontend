export interface ReviewRegisterRequest {
  userToken: string;
  orderId: number;
  productOptionIdList: number[];
  content: string;
  rating: number;
}
