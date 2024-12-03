import PagingRequestQuery from './PagingRequestQuery';

export default interface DeliveryPackageQuery extends PagingRequestQuery {
  searchValue: string;
  status: number;
  dateFrom?: Date;
  dateTo?: Date;
}
