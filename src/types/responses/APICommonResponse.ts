export default interface APICommonResponse {
  isSuccess: boolean;
  isFailure: boolean;
  isWarning: boolean;
  error: {
    code: string;
    message: string;
  };
}
