'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';

export default function Orders() {
  return (
    <MainLayout activeContentIndex={0}>
      <div className="md:col-span-1 py-4">
        <Header title="Quản lý giao dịch" />
      </div>
      <div>
        <p>Quản lý giao dịch</p>
      </div>
    </MainLayout>
  );
}
