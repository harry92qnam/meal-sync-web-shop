import Header from '../../components/common/Header';
import MainLayout from '../../components/layout/MainLayout';

export default function AccountBalance() {
  return (
    <MainLayout activeContentIndex={6}>
      <div className="md:col-span-1 py-4">
        <Header title="Kiểm tra số dư" />
      </div>
      <div>Kiểm tra số dư</div>
    </MainLayout>
  );
}
