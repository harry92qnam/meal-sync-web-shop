'use client';
import CategoryModal from '@/components/category/CategoryModal';
import Header from '@/components/common/Header';
import TableCustom from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { CATEGORY_COLUMNS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import apiClient from '@/services/api-services/api-client';
import { categoryApiService } from '@/services/api-services/api-service-instances';
import CategoryModel from '@/types/models/CategoryModel';
import PageableModel from '@/types/models/PageableModel';
import CategoryQuery from '@/types/queries/CategoryQuery';
import { formatDate, formatNumber } from '@/utils/MyUtils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
  User,
} from '@nextui-org/react';
import { ReactNode, useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Categories() {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const [query, setQuery] = useState<CategoryQuery>({
    name: '',
    pageIndex: 1,
    pageSize: 10,
  } as CategoryQuery);

  const { data: categories } = useFetchWithRQ<CategoryModel, CategoryQuery>(
    REACT_QUERY_CACHE_KEYS.CATEGORIES,
    categoryApiService,
    query,
  );

  const handleAddNewCategory = () => {
    onCreateOpen();
  };

  const handleUpdate = async () => {
    // todo update category
  };

  const handleDelete = async (id: number) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa danh mục này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const responseData = await apiClient.delete(`shop-owner/category/${id}`);
        if (responseData.data.isSuccess) {
          Swal.fire({
            text: 'Đã xóa thành công!',
            icon: 'success',
          });
        }
      }
    });
  };

  const renderCell = useCallback((category: CategoryModel, columnKey: React.Key): ReactNode => {
    const cellValue = category[columnKey as keyof CategoryModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">{category.id}</p>
          </div>
        );
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full', src: category.imageUrl }}
            name={category.name}
            className="flex justify-start ml-12 gap-4"
          />
        );
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-small text-start">{category.description}</p>
          </div>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatDate(category.createdDate)}</p>
          </div>
        );
      case 'numberFoodLinked':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatNumber(category.numberFoodLinked)}</p>
          </div>
        );
      case 'actions':
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <BsThreeDotsVertical className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleUpdate()}>Sửa danh mục</DropdownItem>
                <DropdownItem onClick={() => handleDelete(category.id)}>Xóa danh mục</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        break;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={3}>
      <div className="md:col-span-1 pb-20">
        <Header title="Quản lý danh mục" />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm danh mục..."
        description="danh mục"
        columns={CATEGORY_COLUMNS}
        arrayData={categories?.value.items ?? []}
        searchHandler={(value: string) => {
          setQuery({ ...query, name: value });
        }}
        pagination={categories?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        renderCell={renderCell}
        handleAddNew={handleAddNewCategory}
      />

      <CategoryModal
        isOpen={isCreateOpen}
        onOpen={onCreateOpen}
        onOpenChange={onCreateOpenChange}
      />
    </MainLayout>
  );
}
