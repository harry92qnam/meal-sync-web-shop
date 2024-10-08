import PagingRequestQuery from './PagingRequestQuery';

export default interface ReportQuery extends PagingRequestQuery {
  title: string;
  description: string;
  status: number;
  dateFrom: Date;
  dateTo: Date;
}
