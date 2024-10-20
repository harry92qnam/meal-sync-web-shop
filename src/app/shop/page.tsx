'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import React from 'react';

export default function Shop() {
  return (
    <MainLayout activeContentIndex={8}>
      <div className="md:col-span-1 pb-20">
        <Header title="Quản lý cửa hàng" />
      </div>
    </MainLayout>
  );
}
