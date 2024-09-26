import APICommonResponse from './APICommonResponse';

type MutationResponse<T> = APICommonResponse & {
  value: T;
};

export default MutationResponse;
