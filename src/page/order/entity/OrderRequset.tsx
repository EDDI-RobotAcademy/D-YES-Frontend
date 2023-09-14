import { OrderedProduct } from "./OrderedProduct";
import { OrderedUser } from "./OrderedUser";

export interface OrderRequset {
  orderedUserInfo: OrderedUser;
  orderedProductInfo: OrderedProduct[];
  totalAmount: number;
}
