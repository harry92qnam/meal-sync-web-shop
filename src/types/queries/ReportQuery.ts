import PagingRequestQuery from './PagingRequestQuery';

export default interface ReportQuery extends PagingRequestQuery {
  name: string;
  description: string;
  status: number;
  dateFrom: Date;
  dateTo: Date;
}
