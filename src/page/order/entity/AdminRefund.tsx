import { AdminOrderDetail } from "./AdminOrderDetail";
import { AdminReason } from "./AdminReason";

export interface AdminRefund {
  orderAndTokenAndReasonRequest: AdminReason;
  requestList: Partial<AdminOrderDetail>;
}
