import Header from '../../components/common/Header';
import MainLayout from '../../components/layout/MainLayout';

export default function Shop() {
  return (
    <MainLayout activeContentIndex={7}>
      <div className="md:col-span-1 py-4">
        <Header title="Thông tin cửa hàng" />
      </div>
      <div>Thông tin cửa hàng</div>
    </MainLayout>
  );
}
