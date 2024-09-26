export default interface PageableModel {
  pageIndex: number;
  pageSize: number;
  numberOfItems: 20;
  totalOfPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
