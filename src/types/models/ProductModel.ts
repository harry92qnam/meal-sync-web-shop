export default interface ProductModel {
  id: number;
  shopId: number;
  platformCategoryId: number;
  shopCategory: {
    id: number;
    shopId: number;
    name: string;
    imageUrl: string;
    displayOrder: number;
    description: string;
  };
  operatingSlots: [
    {
      id: number;
      title: string;
      startTime: number;
      endTime: number;
      timeFrameFormat: string;
    },
  ];
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  totalOrder: number;
  status: number;
  isSoldOut: boolean;
}
