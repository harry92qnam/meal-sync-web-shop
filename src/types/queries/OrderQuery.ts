import PagingRequestQuery from './PagingRequestQuery';

export default interface OrderQuery extends PagingRequestQuery {
  id: string;
  deliveryPackageId: string;
  deliveryShopStaffFullName: string;
  phoneNumber: string;
  status: number[];
  dateFrom?: Date;
  dateTo?: Date;
}
