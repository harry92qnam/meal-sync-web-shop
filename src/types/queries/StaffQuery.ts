import PagingRequestQuery from './PagingRequestQuery';

export default interface StaffQuery extends PagingRequestQuery {
  searchValue: string;
  status: number;
  active: number;
}
