export interface OrderRefundDetailInfo {
  orderId: number;
  productOrderId: number;
  totalPrice: number;
  cancelPrice: number;
  orderedTime: string;
  deliveryStatus: string;
  orderedProductStatus: string;
  refundReason: string;
}
