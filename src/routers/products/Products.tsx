import Header from '../../components/common/Header';
import MainLayout from '../../components/layout/MainLayout';

export default function Products() {
  return (
    <MainLayout activeContentIndex={2}>
      <div className="md:col-span-1 py-4">
        <Header title="Quản lý sản phẩm" />
      </div>
      <div>Quản lý sản phẩm</div>
    </MainLayout>
  );
}
