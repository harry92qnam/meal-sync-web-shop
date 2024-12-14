export default interface OrderModel {
  id: number;
  status: number;
  buildingId: number;
  dormitoryId: number;
  dormitoryName: string;
  buildingName: string;
  totalPromotion: number;
  totalPrice: number;
  orderDate: string;
  intendedReceiveDate: string;
  createdDate: string;
  startTime: number;
  endTime: number;
  timeFrameFormat: string;
  isCustomerPaid: boolean;
  note: string;
  reasonIdentity?: string;
  reason?: string;
  shopDeliveryStaff?: {
    id: number;
    fullName: string;
    avatarUrl?: string;
    isShopOwnerShip?: boolean;
  };
  customer: {
    id: number;
    fullName: string;
    phoneNumber: string;
    avatarUrl: string;
    address: string;
  };
  foods: [
    {
      id: number;
      name: string;
      imageUrl: string;
      quantity: number;
    },
  ];
  orderDetails: [
    {
      id: number;
      foodId: number;
      name: string;
      imageUrl: string;
      description: string;
      quantity: number;
      totalPrice: number;
      basicPrice: number;
      note: string;
      optionGroups: [
        {
          optionGroupTitle: string;
          options: [
            {
              optionTitle: string;
              optionImageUrl: string;
              isCalculatePrice: boolean;
              price: number;
            },
          ];
        },
      ];
    },
  ];
}
