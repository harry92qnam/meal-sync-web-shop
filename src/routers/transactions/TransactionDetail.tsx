import { useParams } from 'react-router-dom';

export default function TransactionDetail() {
  const { transactionId } = useParams();

  return (
    <div>
      <h2>Transaction Detail</h2>
      <p>Transaction ID: {transactionId}</p>
    </div>
  );
}
