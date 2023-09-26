export interface OrderStatisticsResponse {
  totalOrdersCount: number;
  completedOrders: number;
  cancelledOrders: number;
  totalOrdersAmount: number;
  monthOverMonthGrowthRate: number;
  orderCountListByDay: number[];
}
