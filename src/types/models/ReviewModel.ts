export default interface ReviewModel {
  id: number;
  orderId: number;
  rating: number;
  comment: string;
  imageUrl?: string;
  entity: number;
  shopId: number;
  status: number;
  customer: {
    id: number;
    fullName: string;
    avatarUrl: string;
  };
  isAllowShopReply: boolean;
  createdDate: string;
}
