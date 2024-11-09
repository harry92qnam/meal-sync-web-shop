import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import CategoryModel from '@/types/models/CategoryModel';
import { toast } from '@/utils/MyUtils';
import { Avatar, Modal, ModalBody, ModalContent } from '@nextui-org/react';
import { useEffect, useState } from 'react';

type CategoryAssignmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  categoryName: string | undefined;
};

export const CategoryAssignmentModal = ({
  isOpen,
  onClose,
  productId,
  categoryName,
}: CategoryAssignmentModalProps) => {
  const { setIsRefetch } = useRefetch();
  const [data, setData] = useState<CategoryModel[]>([]);

  console.log(categoryName);

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get('shop-owner/category');
        console.log(responseData);

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

  const assignCategory = async (categoryId: number) => {
    const payload = {
      foodId: productId,
      shopCategoryId: categoryId,
    };
    try {
      const responseData = await apiClient.put('shop-owner/food/link-shop-category', payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      hideCloseButton
      onClose={onClose}
      className="max-w-72 left-[560px] top-20"
      backdrop="transparent"
    >
      <ModalContent>
        {() => (
          <ModalBody className="flex">
            {data
              .filter((category) => category.name !== categoryName)
              .map((category) => (
                <div
                  key={category?.id}
                  className="flex flex-row items-center gap-2 hover:cursor-pointer hover:opacity-80 hover:text-slate-700"
                  onClick={() => assignCategory(category?.id)}
                >
                  <Avatar src={category?.imageUrl} alt="Avatar" className="rounded-full w-8 h-8" />
                  <p>{category?.name}</p>
                </div>
              ))}
            {data.length === 0 && <p className="text-danger-500 py-2">Không có danh mục nào</p>}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
