'use client';
import Header from '@/components/common/Header';
import { PlusIcon } from '@/components/common/PlusIcon';
import MainLayout from '@/components/layout/MainLayout';
import { AddNewOption } from '@/components/option-groups/AddNewOption';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import ProductModel from '@/types/models/ProductModel';
import { formatCurrency, formatTimeFrame, toast } from '@/utils/MyUtils';
import { BreadcrumbItem, Breadcrumbs, Button, Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ProductDetail({ params }: { params: { slug: number } }) {
  const [data, setData] = useState<ProductModel>();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isRefetch, setIsRefetch } = useRefetch();

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/food/${params.slug}/detail`);
        console.log(responseData, 'responseData');
        if (responseData.data.isSuccess) {
          setData(responseData.data?.value);
          setSelectedId(responseData.data?.value.id);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    })();
  }, [isRefetch]);

  const handleUnlink = async (optionGroupId: number) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn gỡ bỏ lựa chọn này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          optionGroupId: optionGroupId,
          foodId: data?.id,
        };
        console.log(payload, 'payload');

        try {
          const responseData = await apiClient.delete('shop-owner/option-group/unlink-food', {
            data: payload,
          });
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', `Hủy liên kết tới món ăn ${data?.name} thành công`);
          } else {
            console.log('Something went wrong');
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  return (
    <MainLayout activeContentIndex={2}>
      <div className="md:col-span-1 pb-16">
        <Header title="Chi tiết món ăn" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Quản lý thực đơn</BreadcrumbItem>
        <BreadcrumbItem>Chi tiết món ăn</BreadcrumbItem>
      </Breadcrumbs>
      <div className="px-4 py-2">
        <div className="px-8 py-4 shadow-md rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex gap-2">
              <p>Tên món ăn:</p>
              <p className="font-semibold">{data?.name}</p>
            </div>
            <div className="flex gap-2">
              <p>Giá bán:</p>
              <p className="font-semibold">{formatCurrency(data?.price || 0)}</p>
            </div>
            <div className="flex gap-2">
              <p>Khung giờ mở bán:</p>
              <p className="font-semibold">
                {data?.operatingSlots.map((slot, index) => (
                  <span key={slot.startTime}>
                    {formatTimeFrame(slot.startTime, slot.endTime)}
                    {index < data.operatingSlots.length - 1 && ' | '}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex gap-2">
              <p>Mô tả sản phẩm:</p>
              <p className="font-semibold">{data?.description}</p>
            </div>

            <Divider className="my-3" />
            <div className="flex justify-between">
              <p className="text-xl font-bold">Danh sách nhóm lựa chọn đã được liên kết:</p>
              <Button onClick={() => handleAddNew()} endContent={<PlusIcon />}>
                Thêm nhóm lựa chọn
              </Button>
            </div>
            <Divider className="my-2" />
            {!data?.optionGroups.length ? (
              <p className="text-senary text-center">
                Không có nhóm lựa chọn nào đang được liên kết
              </p>
            ) : (
              <>
                {data?.optionGroups.map((option) => (
                  <div
                    key={option.optionGroupId}
                    className="flex items-center py-2 gap-4 justify-between max-w-[500px]"
                  >
                    <p>{option?.title}</p>
                    <Button
                      className="text-white ml-2 bg-senary"
                      onClick={() => {
                        handleUnlink(option.optionGroupId);
                      }}
                    >
                      Gỡ liên kết
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <AddNewOption
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedId}
        existOptions={data?.optionGroups.map((option) => option.optionGroupId)}
      />
    </MainLayout>
  );
}
