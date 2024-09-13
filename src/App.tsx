import Dashboard from './routers/dashboard/Dashboard';
import Login from './routers/login/Login';
import RQZustandTest from './routers/test/RQZustandTest';
import Transactions from './routers/transactions/Transactions';
import TransactionDetail from './routers/transactions/TransactionDetail';
import { Outlet } from 'react-router-dom';

function App() {
  return <Outlet />;
}

export default App;

// Export route configuration
export const routeConfig = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'transactions',
        element: <Transactions />,
        children: [{ path: ':transactionId', element: <TransactionDetail /> }],
      },
      {
        path: 'test',
        element: <RQZustandTest />,
      },
    ],
  },
];
