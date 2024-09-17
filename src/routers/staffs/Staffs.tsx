import Header from '../../components/common/Header';
import MainLayout from '../../components/layout/MainLayout';

export default function Staffs() {
  return (
    <MainLayout activeContentIndex={4}>
      <div className="md:col-span-1 py-4">
        <Header title="Quản lý nhân viên" />
      </div>
      <div>Quản lý nhân viên</div>
    </MainLayout>
  );
}
