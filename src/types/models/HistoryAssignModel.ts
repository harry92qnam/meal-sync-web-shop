export default interface HistoryAssignModel {
  id: number;
  deliveryPackageId: number;
  total: number;
  waiting: number;
  delivering: number;
  successful: number;
  failed: number;
  startTime: number;
  endTime: number;
  timeFrameFormat: string;
  status: number;
  intenededReceiveDate: string;
  shopDeliveryStaff: {
    id: number;
    deliveryPackageId: number;
    fullName: string;
    avatarUrl?: string;
    isShopOwnerShip: boolean;
  };
  dormitories: [
    {
      id: number;
      name: string;
      total: number;
      waiting: number;
      delivering: number;
      successful: number;
      failed: number;
      shopDeliveryStaff: {
        id: number;
        deliveryPackageId: number;
        fullName: string;
        avatarUrl?: string;
        isShopOwnerShip: boolean;
      };
    },
  ];
  orders?: [
    {
      id: number;
      status: number;
      buildingId: number;
      buildingName: string;
      totalPromotion: number;
      totalPrice: number;
      orderDate: string;
      receiveAt?: string;
      completedAt?: string;
      intendedReceiveDate: string;
      createdDate: string;
      dormitoryId: number;
      dormitoryName: string;
      startTime: number;
      endTime: number;
      totalPages: number;
      customer: {
        id: number;
        fullName: string;
        phoneNumber: string;
        avatarUrl?: string;
      };
      shopDeliveryStaff: {
        id: number;
        deliveryPackageId: number;
        fullName: string;
        avatarUrl?: string;
        isShopOwnerShip: boolean;
      };
      foods: [
        {
          id: number;
          name: string;
          imageUrl?: string;
          quantity: number;
        },
      ];
    },
  ];
}
