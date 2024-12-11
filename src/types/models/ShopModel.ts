export default interface ShopModel {
  id: number;
  name: string;
  email: string;
  shopOwnerName: string;
  shopOwnerAvatar?: string;
  status: number;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  phoneNumber: string;
  operatingSlots: [
    {
      id: number;
      title: string;
      startTime: number;
      endTime: number;
      isActive: boolean;
      isReceivingOrderPaused: boolean;
      timeSlot: string;
    },
  ];
  shopDormitories: [
    {
      dormitoryId: number;
      name: string;
    },
  ];
  location: {
    id: number;
    address: string;
  };
  minValueOrderFreeShip: number;
  minOrderHoursInAdvance: number;
  maxOrderHoursInAdvance: number;
  isReceivingOrderPaused: boolean;
  isAutoOrderConfirmation: boolean;
  isAcceptingOrderNextDay: boolean;
  additionalShipFee?: number;
}
