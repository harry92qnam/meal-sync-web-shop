export default interface PackageModel {
  id: number;
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
        deliveryPackageId: number;
        id: number;
        fullName: string;
        avatarUrl: string;
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
            deliveryPackageId: number;
            id: number;
            fullName: string;
            avatarUrl: string;
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
          orderDate: string;
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
            avatarUrl: string;
          };
        },
      ];
    },
  ];
}
