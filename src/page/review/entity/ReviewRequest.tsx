export interface ReviewRequest {
  productName: string;
  optionName: string;
  content: string;
  userNickName: string;
  createDate: Date;
  purchaseDate: string;
  rating: number;
}
