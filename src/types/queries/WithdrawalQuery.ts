import PagingRequestQuery from './PagingRequestQuery';

export default interface WithdrawalQuery extends PagingRequestQuery {
  searchValue: string;
  status: number;
  startDate: Date;
  endDate: Date;
}
