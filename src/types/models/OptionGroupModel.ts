interface OptionGroupModel {
  id: number;
  title: string;
  isRequire: boolean;
  type: number;
  status: number;
  maxChoices: number;
  minChoices: number;
  numOfItemLinked: number;
  options: [
    {
      id: number;
      isDefault: boolean;
      title: string;
      isCalculatePrice: boolean;
      price: number;
      imageUrl: string;
      status: number;
    },
  ];
  foods: [
    {
      id: number;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      isSoldOut: boolean;
      status: number;
    },
  ];
  createdDate: string;
}

export default OptionGroupModel;
