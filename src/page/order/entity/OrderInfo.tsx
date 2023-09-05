import { OrderProduct } from "./OrderProduct";
import { OrderUser } from "./OrderUser";

export interface OrderInfo {
  userResponse: OrderUser;
  productResponseList: OrderProduct[];
}
