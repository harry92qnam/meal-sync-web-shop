'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import apiClient from '@/services/api-services/api-client';
import FoodStatisticModel from '@/types/models/FoodStatisticModel';
import OrderStatisticModel from '@/types/models/OrderStatisticModel';
import OverviewModel from '@/types/models/OverviewModel';
import RevenueStatisticModel from '@/types/models/RevenueStatisticModel';
import DashboardQuery from '@/types/queries/DashboardQuery';
import { formatCurrency, formatNumber } from '@/utils/MyUtils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const { range } = usePeriodTimeFilterState();
  const [overview, setOverview] = useState<OverviewModel>();
  const [orderStatistic, setOrderStatistic] = useState<OrderStatisticModel[]>([]);
  const [foodStatistic, setFoodStatistic] = useState<FoodStatisticModel[]>([]);
  const [revenueStatistic, setRevenueStatistic] = useState<RevenueStatisticModel[]>([]);

  const [query, setQuery] = useState<DashboardQuery>({
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
  } as DashboardQuery);

  console.log(query.dateFrom.toISOString());

  useEffect(() => {
    const overview = async () => {
      try {
        const responseData = await apiClient.get(
          `shop-owner/statistic/summary/web?dateFrom=${query.dateFrom.toISOString()}&dateTo=${query.dateTo.toISOString()}`,
        );
        if (responseData.data.isSuccess) {
          setOverview(responseData.data.value);
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };

    const foodStatistic = async () => {
      try {
        const responseData = await apiClient.get(
          `shop-owner/food/statistic/web?dateFrom=${query.dateFrom.toISOString()}&dateTo=${query.dateTo.toISOString()}`,
        );
        if (responseData.data.isSuccess) {
          setFoodStatistic(responseData.data.value);
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };
    overview();
    foodStatistic();
  }, [query]);

  useEffect(() => {
    const orderStatistic = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/order/statistic/web');
        if (responseData.data.isSuccess) {
          setOrderStatistic(responseData.data.value);
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };

    const revenueStatistic = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/revenue/statistic/web');
        if (responseData.data.isSuccess) {
          setRevenueStatistic(responseData.data.value);
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };
    orderStatistic();
    revenueStatistic();
  }, []);

  useEffect(() => {
    setQuery(
      () =>
        ({
          ...range,
        }) as DashboardQuery,
    );
  }, [range]);

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
          <p className="font-bold text-2xl text-center text-primary">Số liệu tổng quan</p>
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
                <p className="font-bold">{formatCurrency(overview?.revenue ?? 0)}</p>
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
                <p className="font-bold">{formatCurrency(overview?.totalPromotion ?? 0)}</p>
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
                <p className="font-bold">{formatNumber(overview?.totalOrder ?? 0)} (đơn)</p>
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
                <p className="font-bold">{formatNumber(overview?.totalCustomer ?? 0)} (người)</p>
              </div>
            </div>
          </div>
        </div>
        {/* Chart */}
        <div className="flex flex-col gap-2">
          <div className="flex py-4 flex-col justify-center items-center border-small rounded-md shadow-md">
            <p className="font-bold text-xl text-center text-primary">Tỉ lệ doanh thu của món ăn</p>
            <PieChart data={foodStatistic} />
          </div>
        </div>
        <div className="flex flex-col border-small rounded-md shadow-md">
          <div>
            <p className="font-bold text-xl text-center my-4 text-primary">
              Doanh thu cửa hàng trong năm nay
            </p>
            <RevenueChart data={revenueStatistic} />
          </div>
        </div>
        <div className="flex justify-center items-center border-small rounded-md shadow-md">
          <div>
            <p className="font-bold text-xl text-center my-4 text-primary">
              Trạng thái đơn hàng trong năm nay
            </p>
            <OrderStatusChart data={orderStatistic} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
