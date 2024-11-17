'use client';
import { CategoryAssignmentModal } from '@/components/category/CategoryAssignmentModal';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import CategoryModel from '@/types/models/CategoryModel';
import { formatCurrency, toast } from '@/utils/MyUtils';
import { BreadcrumbItem, Breadcrumbs, Button, Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryDetail({ params }: { params: { slug: number } }) {
  const [data, setData] = useState<CategoryModel>();
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isRefetch } = useRefetch();

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/category/${params.slug}`);
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

  const handleAssign = async (productId: number) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  return (
    <MainLayout activeContentIndex={3}>
      <div className="md:col-span-1 pb-16">
        <Header title="Chi tiết danh mục" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Quản lý danh mục</BreadcrumbItem>
        <BreadcrumbItem>Chi tiết danh mục</BreadcrumbItem>
      </Breadcrumbs>
      <div className="px-4 py-2">
        <div className="px-8 py-4 shadow-md border-small rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex gap-2">
              <p>Tên danh mục:</p>
              <p className="font-semibold">{data?.name}</p>
            </div>
            <div className="flex gap-2">
              <p>Mô tả:</p>
              <p className="font-semibold">{data?.description}</p>
            </div>

            <Divider className="my-3" />
            <p className="text-xl font-bold">Danh sách sản phẩm liên kết:</p>
            {!data?.foods.length ? (
              <p className="text-senary text-center">Không có sản phẩm nào đang được liên kết</p>
            ) : (
              <>
                <div className="flex font-bold">
                  <p className="w-[600px]">Tên sản phẩm</p>
                  <p className="w-[400px]">Giá bán</p>
                  <p>Hành động</p>
                </div>
                <Divider className="my-2" />
                {data?.foods.map((food) => (
                  <div key={food.id} className="flex">
                    <p className="w-[600px]">{food.name}</p>
                    <p className="w-[380px]">{formatCurrency(food.price)}</p>
                    <Button
                      className="text-white"
                      color="warning"
                      onClick={() => {
                        handleAssign(food.id);
                      }}
                    >
                      Đổi danh mục
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <CategoryAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={selectedProductId}
        categoryName={data?.name}
      />
    </MainLayout>
  );
}
