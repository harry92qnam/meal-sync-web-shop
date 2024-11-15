'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import apiClient from '@/services/api-services/api-client';
import PromotionModel from '@/types/models/PromotionModel';
import { formatCurrency, formatDate, formatNumber, toast } from '@/utils/MyUtils';
import { BreadcrumbItem, Breadcrumbs, Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PromotionDetail({ params }: { params: { slug: number } }) {
  const [data, setData] = useState<PromotionModel>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/promotion/${params.slug}/detail`);
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

  return (
    <MainLayout activeContentIndex={5}>
      <div className="md:col-span-1 pb-16">
        <Header title="Chi tiết khuyến mãi" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Quản lý khuyến mãi</BreadcrumbItem>
        <BreadcrumbItem>Chi tiết khuyến mãi</BreadcrumbItem>
      </Breadcrumbs>
      <div className="px-4 py-2">
        <div className="px-8 py-4 shadow-md rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex gap-2 items-center">
              <p>Tên khuyến mãi:</p>
              <p className="font-semibold">{data?.title}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Loại áp dụng:</p>
              <Chip
                className={`capitalize ${
                  data?.applyType === 1
                    ? 'bg-cyan-200 text-cyan-600'
                    : 'bg-indigo-200 text-indigo-600'
                }`}
                size="md"
                variant="flat"
              >
                {data?.applyType === 1 ? 'Giảm theo %' : 'Giảm tiền trực tiếp'}
              </Chip>
            </div>
            <div className="flex gap-2 items-center">
              <p>Ngày bắt đầu khuyến mãi:</p>
              <p className="font-bold">{formatDate(data?.startDate ?? '')}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Ngày kết thúc khuyến mãi:</p>
              <p className="font-bold">{formatDate(data?.endDate ?? '')}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Số lượng khuyến mãi đã dùng:</p>
              <p className="font-bold">{formatNumber(data?.numberOfUsed)}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Tổng số lượng khuyến mãi đã tạo:</p>
              <p className="font-bold">{formatNumber(data?.usageLimit)}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Trạng thái khuyến mãi:</p>
              <Chip
                className={`capitalize ${
                  data?.status === 1 ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'
                }`}
                size="md"
                variant="flat"
              >
                {data?.status === 1 ? 'Khả dụng' : 'Đã tạm ẩn'}
              </Chip>
              {!data?.isAvailable && <p className="text-senary font-bold">Đã hết hạn</p>}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
