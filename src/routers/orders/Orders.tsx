import { Button } from '@nextui-org/react';
import { Outlet, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Header from '../../components/common/Header';

export default function Orders() {
  const navigate = useNavigate();

  const orders = [
    { id: '1', title: 'Order 1' },
    { id: '2', title: 'Order 2' },
  ];

  const handleClick = (id: string) => {
    const encodedId = btoa(id);
    navigate(`/orders/${encodedId}`);
  };

  return (
    <MainLayout activeContentIndex={1}>
      <div className="md:col-span-1 py-4">
        <Header title="Quản lý đơn hàng" />
      </div>
      <div>Quản lý đơn hàng</div>
      <div className="flex">
        <div>
          <h1>Orders</h1>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <Button onClick={() => handleClick(order.id)}>{order.title}</Button>
              </li>
            ))}
          </ul>
          <Button onClick={() => navigate('/')}>Back to login</Button>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}
