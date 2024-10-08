export default interface ReportModel {
  id: number;
  customerId: number;
  staffDeliveryId: number;
  orderId: number;
  title: string;
  content: string;
  imageUrl: string;
  status: number;
  reason: string;
  createdDate: string;
}
