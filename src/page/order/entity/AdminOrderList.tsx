import { AdminOrderDetail } from "./AdminOrderDetail";
import { AdminOrderUserInfo } from "./AdminOrderUserInfo";
import { OrderUser } from "./OrderUser";

export interface AdminOrderList {
  orderUserInfo: AdminOrderUserInfo;
  orderProductList: OrderUser;
  orderDetailInfoResponse: AdminOrderDetail;
}
