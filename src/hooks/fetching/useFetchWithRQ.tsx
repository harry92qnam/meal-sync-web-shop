import { APIEntityModel, APIService } from '../../services/api-services/api-service';
import PagingRequestQuery from '../../types/queries/PagingRequestQuery';
import useFetchWithRQConfig from './useFetchWithRQConfig';

const useFetchWithRQ = <Model extends APIEntityModel, Query extends PagingRequestQuery>(
  keyBase: string[],
  apiService: APIService<Model>,
  requestQuery: Query,
  deps?: string[],
) => {
  return useFetchWithRQConfig<Model>(
    keyBase,
    apiService,
    {
      params: { ...requestQuery },
    },
    [requestQuery, ...(deps || [])],
  );
};

export default useFetchWithRQ;
