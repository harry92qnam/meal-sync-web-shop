import PagingRequestQuery from './PagingRequestQuery';

export default interface OptionGroupQuery extends PagingRequestQuery {
  name: string;
  status: number;
}
