import { Button } from '@nextui-org/react';
import REACT_QUERY_CACHE_KEYS from '../../data/constants/react-query-cache-keys';
import useFetchWithRQWithFetchFunc from '../../hooks/fetching/useFetchWithRQWithFetchFunc';
import useCounterState from '../../hooks/states/useCounterState';
import apiClient from '../../services/api-services/api-client';
import { endpoints } from '../../services/api-services/api-service-instances';
import TestModel from '../../types/models/TestModel';
import FetchResponse from '../../types/responses/FetchResponse';

function RQZustandTest() {
  const { counter, increment, reset } = useCounterState();
  // const fetch = useFetchWithRQ<TestModel, PagingRequestQuery>(
  //   REACT_QUERY_CACHE_KEYS.TEST,
  //   testApiService,
  //   {} as PagingRequestQuery
  // );
  const fetch = useFetchWithRQWithFetchFunc(
    REACT_QUERY_CACHE_KEYS.TEST,
    (): Promise<FetchResponse<TestModel>> =>
      apiClient.get(endpoints.TEST).then((response) => response.data),
  );

  console.log(fetch);
  const { data } = fetch;

  return (
    <>
      <div className="m-auto flex justify-center">
        <a href="https://vitejs.dev" target="_blank">
          {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
        </a>
        <a href="https://react.dev" target="_blank">
          {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <h2 className="uppercase">Zustand State Management Demo</h2>
        <Button color="primary" className="mr-2" onClick={() => increment()}>
          count is {counter}
        </Button>
        <Button onClick={() => reset()}>reset</Button>
      </div>
      <div className="card">
        <h2 className="uppercase font-bold text-dark">React Query Fetching Demo</h2>
        <ul>
          {data?.value?.items?.map((model) => (
            <li key={model.id}>
              <h2>{model.name}</h2>
              <p>{model.description}</p>
              <hr></hr>
            </li>
          ))}
        </ul>
      </div>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default RQZustandTest;
