interface OptionGroupModel {
  id: number;
  name: string;
  isRequire: boolean;
  type: number;
  status: number;
  maxChoices: number;
  minChoices: number;
  createdDate: string;
}

export default OptionGroupModel;
