'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import { WITHDRAWAL_STATUS } from '@/data/constants/constants';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import WithdrawalModel from '@/types/models/WithdrawalModel';
import { formatCurrency, toast } from '@/utils/MyUtils';
import { BreadcrumbItem, Breadcrumbs, Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WithdrawalRequestDetail({ params }: { params: { slug: number } }) {
  const [data, setData] = useState<WithdrawalModel>();
  const router = useRouter();
  const { isRefetch } = useRefetch();

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/withdrawal/${params.slug}`);
        if (responseData.data.isSuccess) {
          setData(responseData.data?.value);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    })();
  }, [isRefetch]);

  return (
    <MainLayout activeContentIndex={7}>
      <div className="md:col-span-1 pb-16">
        <Header title="Chi tiết yêu cầu rút tiền" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Quản lý tài chính</BreadcrumbItem>
        <BreadcrumbItem>Chi tiết yêu cầu rút tiền</BreadcrumbItem>
      </Breadcrumbs>
      <div className="px-4 py-2">
        <div className="px-8 py-4 shadow-md border-small rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex gap-2">
              <p>Mã yêu cầu:</p>
              <p className="font-semibold">MS-{data?.id}</p>
            </div>
            <div className="flex gap-2">
              <p>Tên ngân hàng thụ hưởng:</p>
              <p className="font-semibold">{data?.bankShortName}</p>
            </div>
            <div className="flex gap-2">
              <p>Tên tài khoản thụ hưởng:</p>
              <p className="font-semibold">{data?.bankAccountName}</p>
            </div>
            <div className="flex gap-2">
              <p>Số tài khoản thụ hưởng:</p>
              <p className="font-semibold">{data?.bankAccountNumber}</p>
            </div>
            <div className="flex gap-2">
              <p>Số tiền yêu cầu rút:</p>
              <p className="font-semibold">{formatCurrency(data?.amount ?? 0)}</p>
            </div>
            <div className="flex gap-2">
              <p>Trạng thái yêu cầu:</p>
              <Chip
                className={`capitalize ${
                  data?.status === 1
                    ? 'bg-gray-200 text-gray-600'
                    : data?.status === 2
                      ? 'bg-red-200 text-rose-600'
                      : data?.status === 3
                        ? 'bg-yellow-200 text-yellow-600'
                        : data?.status === 4
                          ? 'bg-green-200 text-green-600'
                          : 'bg-red-200 text-rose-600'
                }`}
                size="md"
                variant="flat"
              >
                {WITHDRAWAL_STATUS.find((item) => item.key == data?.status)?.desc}
              </Chip>
            </div>
          </div>
          {data?.reason && (
            <div className="flex gap-2">
              <p>Lý do từ chối:</p>
              <p className="font-semibold">{data?.reason}</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
