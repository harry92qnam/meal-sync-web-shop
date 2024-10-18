'use client';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import {
  OPTION_GROUP_COLUMNS,
  OPTION_GROUP_STATUS,
  PRODUCT_COLUMNS,
  PRODUCT_STATUS,
} from '@/data/constants/constants';
import { sampleOptionGroups, sampleProducts } from '@/data/TestData';
import PageableModel from '@/types/models/PageableModel';
import ProductModel from '@/types/models/ProductModel';
import OptionGroupQuery from '@/types/queries/OptionGroupQuery';
import ProductQuery from '@/types/queries/ProductQuery';
import { formatCurrency, formatDate } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Orders() {
  const router = useRouter();
  const [isActiveTab, setIsActiveTab] = useState(1);
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));

  const handleAddNewProduct = async () => {
    alert('add new product');
  };

  const handleDisable = async () => {
    // todo disable product
  };

  const handleEnable = async () => {
    // todo enable product
  };

  const handleUpdate = async () => {
    // todo update product
  };

  const handleDelete = async () => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa món ăn này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: 'Đã xóa thành công!',
          icon: 'success',
        });
      }
    });
  };

  const openProductDetail = (id: number) => {
    const product = products.find((item) => item.id === id);
    if (!product) {
      router.push('/');
    }
    router.push('products/product-detail');
  };

  // option groups
  const openOptionModal = (id: number) => {
    // onOpen();
    alert('opening');
  };

  const handleAddNewOptionGroup = () => {
    alert('add new option');
  };

  const [productQuery, setProductQuery] = useState<ProductQuery>({
    name: '',
    status: 1,
    pageIndex: 1,
    pageSize: 10,
  } as ProductQuery);

  const [optionGroupQuery, setOptionGroupQuery] = useState<OptionGroupQuery>({
    name: '',
    status: 1,
    pageIndex: 1,
    pageSize: 10,
  } as OptionGroupQuery);

  const products = sampleProducts.value.items;
  // const { data: products } = useFetchWithRQ<ProductModel, ProductQuery>(
  //   REACT_QUERY_CACHE_KEYS.PRODUCTS,
  //   productApiService,
  //   query,
  // );

  const optionList = sampleOptionGroups.value.items;
  // const { data: optionList } = useFetchWithRQ<OptionGroupModel, OptionGroupQuery>(
  //   REACT_QUERY_CACHE_KEYS.OPTIONS,
  //   optionApiService,
  //   query,
  // );

  const statusFilterProducts = [{ key: 0, desc: 'Tất cả' }].concat(
    PRODUCT_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
  );

  const filterProducts = {
    label: 'Trạng thái',
    mappingField: 'status',
    selectionMode: 1,
    options: statusFilterProducts,
    selectedValues: statuses,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setStatuses(values);
      setProductQuery({ ...productQuery, status: value });
    },
  } as TableCustomFilter;

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    OPTION_GROUP_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
  );

  const filterOptions = {
    label: 'Trạng thái',
    mappingField: 'status',
    selectionMode: 1,
    options: statusFilterOptions,
    selectedValues: statuses,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setStatuses(values);
      setOptionGroupQuery({ ...optionGroupQuery, status: value });
    },
  } as TableCustomFilter;

  const productTable = useCallback((product: ProductModel, columnKey: React.Key): ReactNode => {
    const cellValue = product[columnKey as keyof ProductModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">{product.id}</p>
          </div>
        );
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full', src: product.imageUrl }}
            name={product.name}
            className="flex justify-start ml-8 gap-4"
          />
        );
      case 'price':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatCurrency(product.price)}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              product.status === 1 ? 'bg-green-200 text-green-600' : 'bg-red-200 text-rose-600'
            }`}
            size="sm"
            variant="flat"
          >
            {PRODUCT_STATUS.find((item) => item.key == product.status)?.desc}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatDate(product.createdDate)}</p>
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
                {product.status === 1 ? (
                  <DropdownItem onClick={handleDisable}>Tạm hết hàng</DropdownItem>
                ) : (
                  <DropdownItem onClick={handleEnable}>Mở bán lại</DropdownItem>
                )}
                <DropdownItem onClick={handleUpdate}>Sửa món ăn</DropdownItem>
                <DropdownItem onClick={handleDelete}>Xóa món ăn</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const optionTable = useCallback((product: ProductModel, columnKey: React.Key): ReactNode => {
    const cellValue = product[columnKey as keyof ProductModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">{product.id}</p>
          </div>
        );
      case 'name':
        return (
          <div className="flex flex-col">
            <p className="text-small">{product.name}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              product.status === 1 ? 'bg-green-200 text-green-600' : 'bg-red-200 text-rose-600'
            }`}
            size="sm"
            variant="flat"
          >
            {OPTION_GROUP_STATUS.find((item) => item.key == product.status)?.desc}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatDate(product.createdDate)}</p>
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
                {product.status === 1 ? (
                  <DropdownItem onClick={handleDisable}>Tạm ẩn</DropdownItem>
                ) : (
                  <DropdownItem onClick={handleEnable}>Hoạt động lại</DropdownItem>
                )}
                <DropdownItem onClick={handleUpdate}>Sửa lựa chọn</DropdownItem>
                <DropdownItem onClick={handleDelete}>Xóa lựa chọn</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={2}>
      <div className="md:col-span-1 pb-32">
        <Header title="Quản lý sản phẩm" />
      </div>

      <div className="flex fixed top-[72px] z-50 bg-white shadow-md py-2 left-[290px] w-[1230px] justify-around border-t-small">
        {[1, 2].map((tab) => (
          <div key={tab} className={isActiveTab === tab ? 'border-b-2 border-b-primary' : ''}>
            <Button
              onClick={() => {
                if (isActiveTab !== tab) {
                  setIsActiveTab(tab);
                }
              }}
              className={`${isActiveTab === tab ? 'text-primary' : 'text-black'} bg-transparent text-lg font-medium`}
            >
              {tab === 1 ? 'Thực đơn chính' : 'Nhóm lựa chọn'}
            </Button>
          </div>
        ))}
      </div>

      {isActiveTab === 1 ? (
        <TableCustom
          placeHolderSearch="Tìm kiếm món ăn..."
          description="món ăn"
          columns={PRODUCT_COLUMNS}
          // arrayData={products?.value?.items ?? []}
          arrayData={products}
          searchHandler={(value: string) => {
            setProductQuery({ ...productQuery, name: value });
          }}
          pagination={sampleProducts.value as PageableModel}
          goToPage={(index: number) => setProductQuery({ ...productQuery, pageIndex: index })}
          setPageSize={(size: number) => setProductQuery({ ...productQuery, pageSize: size })}
          selectionMode="single"
          isFilter={true}
          filters={[filterProducts]}
          renderCell={productTable}
          handleRowClick={openProductDetail}
          handleAddNew={handleAddNewProduct}
        />
      ) : (
        <>
          <TableCustom
            placeHolderSearch="Tìm kiếm nhóm lựa chọn..."
            description="nhóm lựa chọn"
            columns={OPTION_GROUP_COLUMNS}
            // arrayData={optionList?.value?.items ?? []}
            arrayData={optionList}
            searchHandler={(value: string) => {
              setOptionGroupQuery({ ...optionGroupQuery, name: value });
            }}
            pagination={sampleOptionGroups.value as PageableModel}
            goToPage={(index: number) =>
              setOptionGroupQuery({ ...optionGroupQuery, pageIndex: index })
            }
            setPageSize={(size: number) =>
              setOptionGroupQuery({ ...optionGroupQuery, pageSize: size })
            }
            selectionMode="single"
            isFilter={true}
            filters={[filterOptions]}
            renderCell={optionTable}
            handleRowClick={openOptionModal}
            handleAddNew={handleAddNewOptionGroup}
          />
        </>
      )}
    </MainLayout>
  );
}
