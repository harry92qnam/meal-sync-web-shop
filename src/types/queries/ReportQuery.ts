import PagingRequestQuery from './PagingRequestQuery';

export default interface ReportQuery extends PagingRequestQuery {
  searchValue: string;
  status: number;
  dateFrom: Date;
  dateTo: Date;
}
