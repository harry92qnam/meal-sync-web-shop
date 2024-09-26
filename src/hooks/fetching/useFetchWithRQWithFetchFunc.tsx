import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const useFetchWithRQWithFetchFunc = <Response,>(
  keyBase: any[],
  fetchFunc: () => Promise<Response>,
  deps?: any[],
) => {
  const isFirstRender = useRef(true);

  const query = useQuery<Response, Error>({
    queryKey: keyBase,
    queryFn: fetchFunc,
    // keepPreviousData: true,
  });

  useEffect(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        query.refetch();
      }
    },
    deps ? [...deps] : [],
  );

  return query;
};

export default useFetchWithRQWithFetchFunc;
