import PagingRequestQuery from './PagingRequestQuery';

export default interface PromotionQuery extends PagingRequestQuery {
  title: string;
  status: number;
  type: number;
  dateFrom: Date;
  dateTo: Date;
}
