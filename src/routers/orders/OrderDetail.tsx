import { useParams } from 'react-router-dom';

export default function OrderDetail() {
  const { orderId } = useParams();

  return (
    <div>
      <h2>Order Detail</h2>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
