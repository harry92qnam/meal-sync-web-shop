import PagingRequestQuery from './PagingRequestQuery';

export default interface ReviewQuery extends PagingRequestQuery {
  searchValue: string;
  statusMode: number;
  dateFrom: Date;
  dateTo: Date;
}
