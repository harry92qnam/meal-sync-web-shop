export default interface DeliveryPackageModel {
  intendedReceiveDate: string;
  startTime: number;
  endTime: number;
  deliveryPackageGroups: [
    {
      deliveryPackageId: number;
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
      orders: [
        {
          id: number;
          status: number;
          buildingId: number;
          buildingName: string;
          totalPromotion: number;
          totalPrice: number;
          dormitoryId: number;
          dormitoryName: string;
          startTime: number;
          endTime: number;
          customer: {
            id: number;
            fullName: string;
            phoneNumber: string;
            avatar?: string;
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
    },
  ];
  unassignOrders: [
    {
      id: number;
      status: number;
      buildingId: number;
      buildingName: string;
      totalPromotion: number;
      totalPrice: number;
      dormitoryId: number;
      dormitoryName: string;
      startTime: number;
      endTime: number;
      customer: {
        id: number;
        fullName: string;
        phoneNumber: string;
        avatar?: string;
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
