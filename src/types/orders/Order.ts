export default interface Order {
  id: number;
  shopName: string;
  customerName: string;
  price: number;
  orderDate: string;
  status: number;
  orderInfo: {
    orderId: number;
    orderStatus: number;
    shippingFee: number;
    totalPrice: number;
    totalPromotion: number;
    fullName: string;
    phoneNumber: string;
    distance: number;
    durationShipping: string;
    shopId: number;
    note: string;
    reason: string;
    building: {
      buildingId: number;
      address: string;
      longitude: number;
      latitude: number;
    };
    voucher: {
      promotionId: number;
      title: string;
      amountRate: number;
      amountValue: number;
      minimumOrderValue: number;
      maximumApplyValue: number;
      applyType: number;
      startDate: string;
      endDate: string;
    };
  };
  shopInfo: {
    id: number;
    name: string;
    logoUrl: string;
    bannerUrl: string;
    description: string;
    balance: number;
    phoneNumber: string;
    activeFrom: number;
    activeTo: number;
    totalProduct: number;
    rating: number;
    minimumValueOrderFreeship: number;
    shippingFee: number;
    building: {
      buildingId: number;
      address: string;
      longitude: number;
      latitude: number;
    };
  };
  products: [
    {
      orderId: number;
      productId: number;
      productQuantity: number;
      productPrice: number;
      productName: string;
      imageUrl: string;
      productStatus: number;
      totalProductPrice: number;
      topping: [
        {
          questionId: number;
          questionType: number;
          queDescription: string;
          totalDescription: string;
          options: [
            {
              optionId: number;
              opDescription: string;
              optionPrice: number;
              optionImageUrl: string;
            },
          ];
        },
      ];
    },
  ];
}
