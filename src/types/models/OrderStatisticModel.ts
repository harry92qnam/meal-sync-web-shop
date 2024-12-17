export default interface OrderStatisticModel {
  month: number;
  orderStatisticDetail: {
    total: number;
    totalSuccess: number;
    totalOrderInProcess: number;
    totalFailOrRefund: number;
    totalCancelOrReject: number;
  };
}
