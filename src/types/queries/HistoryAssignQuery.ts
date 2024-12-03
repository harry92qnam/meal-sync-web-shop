import PagingRequestQuery from './PagingRequestQuery';

export default interface HistoryAssignQuery extends PagingRequestQuery {
  searchValue: string;
  statusMode: number;
  dateFrom?: Date;
  dateTo?: Date;
}
