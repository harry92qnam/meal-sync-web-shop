import PagingRequestQuery from './PagingRequestQuery';

export default interface ProductQuery extends PagingRequestQuery {
  name: string;
  status: number;
}