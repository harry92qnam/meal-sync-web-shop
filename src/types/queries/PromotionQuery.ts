import PagingRequestQuery from './PagingRequestQuery';

export default interface PromotionQuery extends PagingRequestQuery {
  searchValue: string;
  status: number;
  applyType: number;
  dateFrom: Date;
  dateTo: Date;
}
