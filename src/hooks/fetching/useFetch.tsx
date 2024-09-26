import { AxiosRequestConfig, CanceledError } from 'axios';
import { useEffect, useState } from 'react';
import { APIEntityModel, APIService } from '../../services/api-services/api-service';
import PageableModel from '../../types/models/PageableModel';
import FetchResponse from '../../types/responses/FetchResponse';

const useFetch = <M extends APIEntityModel>(
  service: APIService<M>,
  requestConfig?: AxiosRequestConfig,
  deps?: any[],
) => {
  const [models, setModels] = useState<M[]>([]);
  const [pageable, setPageable] = useState<PageableModel>({} as PageableModel);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    () => {
      setIsLoading(true);

      const { request, cancel } = service.getAll<FetchResponse<M>>(requestConfig);

      request
        .then((response) => {
          setModels(response.data.value.items);
          setPageable(response.data.value as PageableModel);
          setIsLoading(false); // hide the loader
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setIsError(true);
          setError(err.message);
          setIsLoading(false); // hide the loader
        });

      return () => cancel();
    },
    deps ? [...deps] : [],
  );

  return { models, pageable, isLoading, isError, error, setModels, setError };
};

export default useFetch;
