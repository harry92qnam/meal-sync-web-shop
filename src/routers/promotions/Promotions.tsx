import Header from '../../components/common/Header';
import MainLayout from '../../components/layout/MainLayout';

export default function Promotions() {
  return (
    <MainLayout activeContentIndex={3}>
      <div className="md:col-span-1 py-4">
        <Header title="Quản lý khuyến mãi" />
      </div>
      <div>Quản lý khuyến mãi</div>
    </MainLayout>
  );
}
