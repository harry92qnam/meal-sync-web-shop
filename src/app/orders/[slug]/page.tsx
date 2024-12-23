'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import apiClient from '@/services/api-services/api-client';
import OrderModel from '@/types/models/OrderModel';
import {
  formatCurrency,
  formatNumber,
  formatPhoneNumber,
  formatTimeFrame,
  formatTimeToSeconds,
  isLocalImage,
  toast,
} from '@/utils/MyUtils';
import { BreadcrumbItem, Breadcrumbs, Chip, Divider } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetail({ params }: { params: { slug: number } }) {
  const [data, setData] = useState<OrderModel>();
  const [reportId, setReportId] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
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
    };
    const fetchReport = async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/order/${params.slug}/report`);
        if (responseData.data.isSuccess) {
          const reportIdValue = responseData.data.value[0].id;
          setReportId(reportIdValue);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };
    fetchData();
    fetchReport();
  }, []);

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
        <div className="px-8 py-4 shadow-md border-small rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center text-primary text-xl">
                <p>Mã đơn hàng:</p>
                <p className="font-semibold">MS-{data?.id}</p>
              </div>
              <div className="flex gap-2 items-center">
                {data?.status === 10 && (
                  <p
                    className="underline text-primary text-sm cursor-pointer"
                    onClick={() => router.push(`/reports/${reportId}`)}
                  >
                    Chi tiết báo cáo
                  </p>
                )}
                {data?.status === 11 && (
                  <p
                    className="underline text-primary text-sm cursor-pointer"
                    onClick={() => router.push(`/reports/${reportId}`)}
                  >
                    Chi tiết báo cáo
                  </p>
                )}
                {data?.status === 12 && (
                  <p
                    className="underline text-primary text-sm cursor-pointer"
                    onClick={() => router.push(`/reports/${reportId}`)}
                  >
                    Chi tiết báo cáo
                  </p>
                )}
                <Chip
                  className={
                    data?.status === 1
                      ? 'text-gray-600 bg-gray-200 font-bold capitalize'
                      : data?.status === 5 ||
                          data?.status === 6 ||
                          data?.status === 11 ||
                          data?.status === 10
                        ? 'text-yellow-600 bg-yellow-200 font-bold capitalize'
                        : data?.status === 3
                          ? 'text-cyan-600 bg-cyan-200 font-bold capitalize'
                          : data?.status === 12
                            ? 'bg-purple-200 text-purple-600 font-bold capitalize'
                            : data?.status === 7 || data?.status === 9
                              ? 'text-green-600 bg-green-200 font-bold capitalize'
                              : 'text-rose-600 bg-red-200 font-bold capitalize'
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
                                    ? 'Hoàn thành'
                                    : data?.status === 10
                                      ? 'Đang bị báo cáo'
                                      : data?.status === 11
                                        ? 'Đang xử lý báo cáo'
                                        : 'Đã xử lý báo cáo'}
                </Chip>
              </div>
            </div>
            <div className="mt-2">
              <strong className="text-xl text-cyan-500">Thông tin khách hàng:</strong>
              <div className="flex gap-2 items-center">
                <p>Tên người nhận hàng:</p>
                <p className="font-semibold">{data?.customer.fullName}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p>Địa chỉ nhận hàng:</p>
                <p className="font-semibold">{data?.customer?.address}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p>Số điện thoại người nhận:</p>
                <p className="font-semibold">
                  {formatPhoneNumber(data?.customer?.phoneNumber ?? '')}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <p>Khung giờ nhận hàng</p>
                <p className="font-semibold">{formatTimeFrame(data?.startTime, data?.endTime)}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p>Trạng thái thanh toán:</p>
                <p
                  className={`font-semibold ${data?.isCustomerPaid ? 'text-green-500' : 'text-red-500'}`}
                >
                  {data?.isCustomerPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <p>Thời gian giao dịch:</p>
                <p className="font-semibold">{formatTimeToSeconds(data?.orderDate ?? '')}</p>
              </div>
            </div>
            {data?.isCustomerPaid && !data?.isDeliveredByQR && data?.deliverySuccessImageUrls && (
              <div>
                <p>Hình ảnh nhận hàng:</p>
                {data?.deliverySuccessImageUrls.map((evidence, index) => (
                  <div key={index} className="flex">
                    {!isLocalImage(evidence || '') && (
                      <Image
                        src={evidence || ''}
                        alt={`Image ${index + 1}`}
                        width={100}
                        height={100}
                        quality={100}
                        className="rounded-lg w-44 h-44 object-cover border-small"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {data?.reasonIdentity && (
              <div className="mt-3 text-lg">
                {data.reasonIdentity !== 'DeliveredReportedByCustomer' && (
                  <strong className="text-xl text-red-500">Lý do đơn thất bại:</strong>
                )}
                {data.reasonIdentity === 'ShopCancel' ? (
                  <div>
                    Người hủy: <span className="font-bold">Chủ cửa hàng</span>{' '}
                    <p>
                      Lý do: <span className="font-bold">{data.reason}</span>
                    </p>
                  </div>
                ) : data.reasonIdentity === 'CustomerCancel' ? (
                  <div>
                    Người hủy: <span className="font-bold">Khách hàng</span>{' '}
                    <p>
                      Lý do: <span className="font-bold">{data.reason}</span>
                    </p>
                  </div>
                ) : data.reasonIdentity === 'DeliveryFailByShop' ? (
                  <div>
                    Nguyên nhân giao thất bại: <span className="font-bold">Chủ cửa hàng</span>{' '}
                    <p>
                      Lý do: <span className="font-bold">{data.reason}</span>
                    </p>
                  </div>
                ) : data.reasonIdentity === 'DeliveryFailByCustomerReportedByCustomer' ? (
                  <div>
                    Nguyên nhân giao thất bại: <span className="font-bold">Khách hàng</span>{' '}
                    <p>
                      Lý do: <span className="font-bold">{data.reason}</span>
                    </p>
                  </div>
                ) : data.reasonIdentity === 'DeliveryFailByShopReportedByCustomer' ? (
                  <div>
                    Nguyên nhân giao thất bại: <span className="font-bold">Chủ cửa hàng</span>{' '}
                    <p>
                      Lý do: <span className="font-bold">{data.reason}</span>
                    </p>
                  </div>
                ) : data.reasonIdentity === 'DeliveryFailByCustomer' ? (
                  <div>
                    Nguyên nhân giao thất bại: <span className="font-bold">Khách hàng</span>{' '}
                    <p>
                      Lý do: <span className="font-bold">{data.reason}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <strong className="text-xl text-red-500">
                      Đơn hàng giao thành công bị báo cáo
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {data?.evidences && data?.evidences.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              <p className="text-xl text-red-500 font-bold">Hình ảnh chứng minh:</p>
              <div className="flex flex-wrap gap-2">
                {data?.evidences.map((evidence, index) => (
                  <div key={index} className="flex flex-col gap-2 items-center">
                    {!isLocalImage(evidence.imageUrl || '') && (
                      <Image
                        src={evidence.imageUrl || ''}
                        alt={`Image ${index + 1}`}
                        width={100}
                        height={100}
                        quality={100}
                        className="rounded-lg w-44 h-44 object-cover border-small"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2">
            <strong className="text-xl text-cyan-500">Thông tin sản phẩm:</strong>
            {data?.orderDetails.map((food) => (
              <div key={food.id}>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="flex gap-4">
                      {!isLocalImage(food.imageUrl) && (
                        <Image
                          src={food.imageUrl}
                          alt="Food image"
                          width={100}
                          height={100}
                          className="border-small rounded-lg w-44 h-44 object-cover"
                        />
                      )}
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
                {food.note && (
                  <p>
                    <strong>Ghi chú món ăn: </strong> <span>{food.note}</span>
                  </p>
                )}
                <Divider />
              </div>
            ))}
          </div>
          {data?.note && (
            <p className="py-4">
              <strong>Ghi chú đơn hàng: </strong>
              {data?.note?.split('\n').map((item, index) => <span key={index}>{item}</span>)}
            </p>
          )}
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
