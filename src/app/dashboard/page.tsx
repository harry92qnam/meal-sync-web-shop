import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import { formatCurrency, formatNumber } from '@/utils/MyUtils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';

const overview = {
  revenue: 1000000,
  numberOfOrders: 1200,
  numberOfUsers: 38,
  promotion: 120000,
};

const PieChart = dynamic(() => import('@/components/dashboard/PieChart'), {
  ssr: false,
});
const RevenueChart = dynamic(() => import('@/components/dashboard/RevenueChart'), {
  ssr: false,
});
const OrderStatusChart = dynamic(() => import('@/components/dashboard/OrderStatusChart'), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <MainLayout activeContentIndex={0}>
      <div className="md:col-span-1 pb-16">
        <Header title="Thống kê tổng quan" />
      </div>
      <div className="flex justify-end mb-2">
        <DateRangeFilter />
      </div>
      {/* Overview */}
      <div className="grid grid-cols-2 gap-5">
        <div className="py-8 px-4 border-small rounded-md shadow-md gap-6 flex flex-col">
          <p className="font-bold text-2xl text-center text-primary">Các thông số cơ bản</p>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={'/images/revenue.png'}
                alt="Revenue image"
                width={52}
                height={52}
                className="w-[72px] h-[72px]"
              />
              <div className="flex flex-col text-lg">
                <p>Tổng doanh thu</p>
                <p className="font-bold">{formatCurrency(overview.revenue)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Image
                src={'/images/promotion.png'}
                alt="Promotion image"
                width={52}
                height={52}
                className="w-[80px] h-[80px]"
              />
              <div className="flex flex-col text-lg">
                <p>Tổng tiền đã khuyến mãi</p>
                <p className="font-bold">{formatCurrency(overview.promotion)}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={'/images/order.png'}
                alt="Order image"
                width={52}
                height={52}
                className="w-[60px] h-[60px]"
              />
              <div className="flex flex-col text-lg">
                <p>Tổng đơn hàng</p>
                <p className="font-bold">{formatNumber(overview.numberOfOrders)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src={'/images/customer.png'}
                alt="Customer image"
                width={52}
                height={52}
                className="w-[60px] h-[60px]"
              />
              <div className="flex flex-col text-lg mr-8">
                <p>Số lượng khách hàng</p>
                <p className="font-bold">{formatNumber(overview.numberOfUsers)}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Chart */}
        <div className="flex flex-col gap-2">
          <div className="flex py-4 flex-col justify-center items-center border-small rounded-md shadow-md">
            <p className="font-bold text-xl text-center text-primary">Tỉ lệ doanh thu của món ăn</p>
            <PieChart />
          </div>
        </div>
        <div className="flex flex-col border-small rounded-md shadow-md">
          <div>
            <p className="font-bold text-xl text-center my-4 text-primary">
              Doanh thu cửa hàng trong năm nay
            </p>
            <RevenueChart />
          </div>
        </div>
        <div className="flex justify-center items-center border-small rounded-md shadow-md">
          <div>
            <p className="font-bold text-xl text-center my-4 text-primary">
              Trạng thái đơn hàng trong năm nay
            </p>
            <OrderStatusChart />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
