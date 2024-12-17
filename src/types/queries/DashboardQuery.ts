import PagingRequestQuery from './PagingRequestQuery';

export default interface DashboardQuery extends PagingRequestQuery {
  dateFrom: Date;
  dateTo: Date;
}
