import { Outlet } from 'react-router-dom';
import AccountBalance from './routers/account-balance/AccountBalance';
import ForgotPassword from './routers/authentication/ForgotPassword';
import Login from './routers/authentication/Login';
import Register from './routers/authentication/Register';
import ResetPassword from './routers/authentication/ResetPassword';
import VerifyCodeRegister from './routers/authentication/VerifyCodeRegister';
import VerifyCodeReset from './routers/authentication/VerifyCodeReset';
import Dashboard from './routers/dashboard/Dashboard';
import OrderDetail from './routers/orders/OrderDetail';
import Orders from './routers/orders/Orders';
import Products from './routers/products/Products';
import Profile from './routers/profile/Profile';
import Promotions from './routers/promotions/Promotions';
import Reports from './routers/reports/Reports';
import Shop from './routers/shop/Shop';
import Staffs from './routers/staffs/Staffs';

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
      { path: 'products', element: <Products /> },
      { path: 'promotions', element: <Promotions /> },
      { path: 'staffs', element: <Staffs /> },
      { path: 'reports', element: <Reports /> },
      { path: 'account-balance', element: <AccountBalance /> },
      { path: 'shop', element: <Shop /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
];
