export default interface PromotionModel {
  id: number;
  title: string;
  description: string;
  bannerUrl: string;
  type: number;
  amountRate: number;
  amountValue: number;
  minOrderValue: number;
  maximumApplyValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  numberOfUsed: number;
  applyType: number;
  status: number;
  createdDate: string;
}
