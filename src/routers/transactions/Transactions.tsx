import { Button } from '@nextui-org/react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Transactions() {
  const navigate = useNavigate();

  const transactions = [
    { id: '1', title: 'Transaction 1' },
    { id: '2', title: 'Transaction 2' },
  ];

  const handleClick = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  return (
    <div className="flex">
      <div>
        <h1>Transactions</h1>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <Button onClick={() => handleClick(transaction.id)}>{transaction.title}</Button>
            </li>
          ))}
        </ul>
        <Button onClick={() => navigate('/')}>Back to login</Button>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
