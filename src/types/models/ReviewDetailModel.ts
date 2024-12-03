export default interface ReviewDetailModel {
  orderId: number;
  description: string;
  isAllowShopReply: boolean;
  reviews: [
    {
      id: number;
      name: string;
      avatar: string;
      reviewer: number;
      rating: number;
      comment: string;
      imageUrls?: string[];
      createdDate: string;
    },
  ];
}
