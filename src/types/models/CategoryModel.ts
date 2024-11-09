export default interface CategoryModel {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  numberFoodLinked: number;
  createdDate: string;
  foods: [
    {
      id: number;
      name: string;
      price: number;
      status: number;
      imageUrl?: string;
      isSoldOut: boolean;
    },
  ];
}
