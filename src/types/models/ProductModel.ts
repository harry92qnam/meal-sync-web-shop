export default interface ProductModel {
  id: number;
  platformCategoryId: number;
  shopCategoryId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  totalOrder: number;
  status: number;
  isSoldOut: boolean;
  createdDate: string;
}
