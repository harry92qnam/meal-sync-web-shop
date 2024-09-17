import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Header from '../../components/common/Header';

export default function Profile() {
  return (
    <MainLayout activeContentIndex={8}>
      <div className="md:col-span-1 py-4">
        <Header title="Thông tin cá nhân" />
      </div>
      <div>Thông tin cá nhân</div>
    </MainLayout>
  );
}
