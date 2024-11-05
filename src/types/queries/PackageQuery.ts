import PagingRequestQuery from './PagingRequestQuery';

export default interface PackageQuery extends PagingRequestQuery {
  id: string;
  staffName: string;
  status: number[];
  dateFrom: Date;
  dateTo: Date;
}
