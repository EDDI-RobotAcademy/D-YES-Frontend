import { OrderdProduct } from "./OrderedProduct";
import { OrderedUser } from "./OrderedUser";

export interface OrderRequset {
  orderedUserInfo: OrderedUser;
  orderedProductInfo: OrderdProduct[];
  totalAmount: number;
}
