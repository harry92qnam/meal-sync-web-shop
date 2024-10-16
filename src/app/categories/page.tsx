'use client';
import Header from '@/components/common/Header';
import TableCustom from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { CATEGORY_COLUMNS } from '@/data/constants/constants';
import { sampleCategories } from '@/data/TestData';
import CategoryModel from '@/types/models/CategoryModel';
import PageableModel from '@/types/models/PageableModel';
import CategoryQuery from '@/types/queries/CategoryQuery';
import { formatDate } from '@/utils/MyUtils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { ReactNode, useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function Categories() {
  const handleUpdate = async () => {
    // todo update category
  };

  const handleDelete = async () => {
    // todo delete category
  };

  const [query, setQuery] = useState<CategoryQuery>({
    name: '',
    pageIndex: 1,
    pageSize: 10,
  } as CategoryQuery);

  const categories = sampleCategories.value.items;
  // const { data: categories } = useFetchWithRQ<CategoryModel, CategoryQuery>(
  //   REACT_QUERY_CACHE_KEYS.CATEGORIES,
  //   categoryApiService,
  //   query,
  // );

  const renderCell = useCallback((category: CategoryModel, columnKey: React.Key): ReactNode => {
    const cellValue = category[columnKey as keyof CategoryModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{category.id}</p>
          </div>
        );
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full', src: category.imageUrl }}
            name={category.name}
            className="flex justify-start font-semibold"
          >
            {category.name}
          </User>
        );
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{category.description}</p>
          </div>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(category.createdDate)}</p>
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
                <DropdownItem onClick={handleUpdate}>Sửa danh mục</DropdownItem>
                <DropdownItem onClick={handleDelete}>Xóa danh mục</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={4}>
      <div className="md:col-span-1 pb-20">
        <Header title="Quản lý danh mục" />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm danh mục..."
        description="danh mục"
        columns={CATEGORY_COLUMNS}
        // arrayData={categories?.value?.items ?? []}
        arrayData={categories}
        searchHandler={(value: string) => {
          setQuery({ ...query, name: value });
        }}
        pagination={sampleCategories.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        isFilter={true}
        renderCell={renderCell}
        isAddNew={true}
      />
    </MainLayout>
  );
}
