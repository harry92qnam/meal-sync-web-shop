export default interface PageableModel {
  pageIndex: number;
  pageSize: number;
  numberOfItems: number;
  totalOfPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
