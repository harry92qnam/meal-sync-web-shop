import PagingRequestQuery from './PagingRequestQuery';

export default interface StaffQuery extends PagingRequestQuery {
  name: string;
  status: number;
}
