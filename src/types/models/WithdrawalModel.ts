export default interface WithdrawalModel {
  id: number;
  amount: number;
  status: number;
  bankCode: string;
  bankShortName: string;
  bankAccountNumber: string;
  reason?: string;
  createdDate: string;
  walletHistory: {
    walletId: number;
    availableAmountBefore: number;
    incomingAmountBefore: number;
    reportingAmountBefore: number;
  };
}
