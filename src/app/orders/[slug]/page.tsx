'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import apiClient from '@/services/api-services/api-client';
import OrderModel from '@/types/models/OrderModel';
import {
  formatCurrency,
  formatNumber,
  formatPhoneNumber,
  formatTimeToSeconds,
  toast,
} from '@/utils/MyUtils';
import { BreadcrumbItem, Breadcrumbs, Divider } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function OrderDetail({ params }: { params: { slug: number } }) {
  const [data, setData] = useState<OrderModel>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/order/${params.slug}`);

        if (responseData.data.isSuccess) {
          setData(responseData.data?.value);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    })();
  }, []);

  console.log(data);

  return (
    <MainLayout activeContentIndex={1}>
      <div className="md:col-span-1 pb-16">
        <Header title="Đơn hàng chi tiết" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Quản lý đơn hàng</BreadcrumbItem>
        <BreadcrumbItem>Đơn hàng chi tiết</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-2xl font-bold pl-4 py-2">Thông tin đơn hàng</h1>
      <div className="px-4 py-2">
        <div className="px-8 py-4 shadow-md rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex justify-between">
              <p>Tên người nhận hàng:</p>
              <p className="font-semibold">{data?.customer.fullName}</p>
            </div>
            <div className="flex justify-between">
              <p>Địa chỉ nhận hàng:</p>
              <p className="font-semibold">{data?.customer?.address}</p>
            </div>
            <div className="flex justify-between">
              <p>Số điện thoại người nhận:</p>
              <p className="font-semibold">
                {formatPhoneNumber(data?.customer?.phoneNumber ?? '')}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Khung giờ nhận hàng</p>
              <p className="font-semibold">{data?.timeFrameFormat}</p>
            </div>
            <div className="flex justify-between">
              <p>Thời gian giao dịch:</p>
              <p className="font-semibold">{formatTimeToSeconds(data?.orderDate ?? '')}</p>
            </div>
            <div className="flex justify-between">
              <p>Trạng thái đơn hàng:</p>
              <p
                className={
                  data?.status === 1 ||
                  data?.status === 3 ||
                  data?.status === 5 ||
                  data?.status === 6 ||
                  data?.status === 10 ||
                  data?.status === 11
                    ? 'text-orange-500 font-bold capitalize'
                    : data?.status === 7 || data?.status === 9 || data?.status === 12
                      ? 'text-green-500 font-bold capitalize'
                      : 'text-rose-500 font-bold capitalize'
                }
              >
                {data?.status === 1
                  ? 'Chờ xác nhận'
                  : data?.status === 2
                    ? 'Đã từ chối'
                    : data?.status === 3
                      ? 'Đã xác nhận'
                      : data?.status === 4
                        ? 'Đã hủy'
                        : data?.status === 5
                          ? 'Đang chuẩn bị'
                          : data?.status === 6
                            ? 'Đang giao hàng'
                            : data?.status === 7
                              ? 'Giao hàng thành công'
                              : data?.status === 8
                                ? 'Giao hàng thất bại'
                                : data?.status === 9
                                  ? 'Hoàn thành đơn hàng'
                                  : data?.status === 10
                                    ? 'Đang bị báo cáo'
                                    : data?.status === 11
                                      ? 'Đang kiểm tra báo cáo'
                                      : 'Đã xử lý báo cáo'}
              </p>
            </div>
          </div>
          <Divider className="mt-4" />
          {data?.orderDetails.map((food) => (
            <>
              <div key={food.id} className="flex justify-between items-center py-4">
                <div>
                  <div className="flex gap-4">
                    <Image src={food.imageUrl} alt="Food image" width={120} height={120} />
                    <div className="flex flex-col justify-center">
                      <div className="text-xl">
                        {food.name} ({formatCurrency(food.basicPrice)})
                        <p>
                          <strong>x{food.quantity}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  {food.optionGroups.map(
                    (q) =>
                      q.options?.length > 0 && (
                        <>
                          <p className="font-bold text-slate-500 mt-4">{q.optionGroupTitle}:</p>
                          {q.options.map((option) =>
                            option.price > 0 ? (
                              <p className="text-slate-500" key={option.optionTitle}>
                                - {option.optionTitle} (+
                                {formatCurrency(option.price)}) x {formatNumber(food.quantity)}
                              </p>
                            ) : (
                              <p className="text-slate-500" key={option.optionTitle}>
                                - {option.optionTitle}
                              </p>
                            ),
                          )}
                        </>
                      ),
                  )}
                </div>
                <strong className="text-xl">{formatCurrency(food.totalPrice)}</strong>
              </div>
              <Divider />
            </>
          ))}
          <p className="py-4">
            <strong>Ghi chú thêm:</strong>
            {data?.note.split('\n').map((item, index) => <p key={index}>{item}</p>)}
          </p>
          <Divider />
          <div className="flex flex-col ml-auto w-1/3 pt-4 text-lg">
            <div className="flex justify-between">
              <p>Tổng hoá đơn:</p>
              <p className="">{formatCurrency(data?.totalPrice ?? 0)}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá:</p>
              <p className="">{formatCurrency(data?.totalPromotion ?? 0)}</p>
            </div>
            <div className="flex justify-between text-primary font-bold text-2xl">
              <p>Thành tiền:</p>
              <p>{formatCurrency((data?.totalPrice ?? 0) - (data?.totalPromotion ?? 0))}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
