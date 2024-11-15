export default interface PromotionModel {
  id: number;
  title: string;
  description: string;
  bannerUrl: string;
  applyType: number;
  amountRate: number;
  amountValue: number;
  minOrderValue: number;
  minOrdervalue: number;
  maximumApplyValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  isAvailable: boolean;
  numberOfUsed: number;
  status: number;
  createdDate: string;
}
