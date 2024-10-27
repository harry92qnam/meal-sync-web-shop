import PagingRequestQuery from './PagingRequestQuery';

export default interface OptionGroupQuery extends PagingRequestQuery {
  title: string;
  status: number;
}
