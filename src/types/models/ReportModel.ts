export default interface ReportModel {
  id: number;
  shopId?: number;
  customerId: number;
  orderId: number;
  title: string;
  content: string;
  imageUrl: string;
  status: number;
  reason?: string;
  isAllowShopReply: boolean;
  createdDate: string;
  customer: {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    avatarUrl?: string;
  };
}
