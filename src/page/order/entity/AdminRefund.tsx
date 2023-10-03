import { AdminReason } from "./AdminReason";
import { RefundProductOptiontId } from "./RefundProductOptiontId";

export interface AdminRefund {
  orderAndTokenAndReasonRequest: AdminReason;
  requestList: RefundProductOptiontId[];
}
