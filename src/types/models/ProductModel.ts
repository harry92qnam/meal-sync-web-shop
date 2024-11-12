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
  optionGroups: [
    {
      id: number;
      optionGroupId: number;
      title: string;
      isRequire: boolean;
      status: number;
      option: [
        {
          id: number;
          title: string;
          price: number;
          status: number;
          isDefault: boolean;
          isCalculatePrice: boolean;
          imageUrl: string;
        },
      ];
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
