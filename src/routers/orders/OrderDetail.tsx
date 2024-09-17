import { useParams } from 'react-router-dom';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const decodedId = orderId ? atob(orderId) : '';
  return (
    <div>
      <h2>Order Detail</h2>
      <p>Order ID: {decodedId}</p>
    </div>
  );
}
