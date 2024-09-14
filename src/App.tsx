import { Outlet } from 'react-router-dom';
import Dashboard from './routers/dashboard/Dashboard';
import Login from './routers/authentication/Login';
import OrderDetail from './routers/orders/OrderDetail';
import Orders from './routers/orders/Orders';
import RQZustandTest from './routers/test/RQZustandTest';
import Register from './routers/authentication/Register';
import ForgotPassword from './routers/authentication/ForgotPassword';
import ResetPassword from './routers/authentication/ResetPassword';
import VerifyCodeRegister from './routers/authentication/VerifyCodeRegister';
import VerifyCodeReset from './routers/authentication/VerifyCodeReset';

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
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-register', element: <VerifyCodeRegister /> },
      { path: 'verify-reset', element: <VerifyCodeReset /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'orders',
        element: <Orders />,
        children: [{ path: ':orderId', element: <OrderDetail /> }],
      },
      {
        path: 'test',
        element: <RQZustandTest />,
      },
    ],
  },
];
