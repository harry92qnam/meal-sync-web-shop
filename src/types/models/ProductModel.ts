export default interface ProductModel {
  id: number;
  shopId: number;
  platformCategoryId: number;
  shopCategoryId: number;
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
  optionGroups: [];
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  totalOrder: number;
  status: number;
  isSoldOut: boolean;
}
