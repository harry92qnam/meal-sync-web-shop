import PagingRequestQuery from './PagingRequestQuery';

export default interface PromotionQuery extends PagingRequestQuery {
  name: string;
  status: number;
  type: number;
  dateFrom: Date;
  dateTo: Date;
}
