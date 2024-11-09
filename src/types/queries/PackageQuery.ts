import PagingRequestQuery from './PagingRequestQuery';

export default interface PackageQuery extends PagingRequestQuery {
  deliveryPackageId: string;
  deliveryShopStaffFullName: string;
  // frame: string;
  dateFrom?: Date;
  dateTo?: Date;
}
