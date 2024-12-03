'use client';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import OptionGroupCreateModal from '@/components/option-groups/OptionGroupCreateModal';
import OptionGroupUpdateModal from '@/components/option-groups/OptionGroupUpdateModal';
import ProductCreateModal from '@/components/product/ProductCreateModal';
import ProductUpdateModal from '@/components/product/ProductUpdateModal';
import {
  OPTION_GROUP_COLUMNS,
  OPTION_GROUP_STATUS,
  PRODUCT_COLUMNS,
  PRODUCT_STATUS,
} from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { optionApiService, productApiService } from '@/services/api-services/api-service-instances';
import OptionGroupModel from '@/types/models/OptionGroupModel';
import PageableModel from '@/types/models/PageableModel';
import ProductModel from '@/types/models/ProductModel';
import OptionGroupQuery from '@/types/queries/OptionGroupQuery';
import ProductQuery from '@/types/queries/ProductQuery';
import { formatCurrency, formatDate, formatNumber, toast } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  useDisclosure,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Orders() {
  const router = useRouter();
  const [isActiveTab, setIsActiveTab] = useState(1);
  const [productStatuses, setProductStatuses] = useState<Selection>(new Set(['0']));
  const [optionStatuses, setOptionStatuses] = useState<Selection>(new Set(['0']));
  const { isRefetch, setIsRefetch } = useRefetch();
  const [productDetail, setProductDetail] = useState<ProductModel | null>(null);
  const [optionGroupDetail, setOptionGroupDetail] = useState<OptionGroupModel | null>(null);
  const {
    isOpen: isProductCreateOpen,
    onOpen: onProductCreateOpen,
    onOpenChange: onProductCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isProductUpdateOpen,
    onOpen: onProductUpdateOpen,
    onOpenChange: onProductUpdateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isOptionGroupCreateOpen,
    onOpen: onOptionGroupCreateOpen,
    onOpenChange: onOptionGroupCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isOptionGroupUpdateOpen,
    onOpen: onOptionGroupUpdateOpen,
    onOpenChange: onOptionGroupUpdateOpenChange,
  } = useDisclosure();

  /**
   * Product action
   */
  const handleAddNewProduct = () => {
    onProductCreateOpen();
  };

  const handleDisableProduct = async (id: number) => {
    try {
      const payload = {
        status: 2,
        isSoldOut: false,
      };
      const responseData = await apiClient.put(`shop-owner/food/${id}/status`, payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log('>>> error', error);
    }
  };

  const handleActiveProduct = async (id: number) => {
    try {
      const payload = {
        status: 1,
        isSoldOut: false,
      };
      const responseData = await apiClient.put(`shop-owner/food/${id}/status`, payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log('>>> error', error);
    }
  };

  const handleSoldOutProduct = async (id: number) => {
    try {
      const payload = {
        status: 1,
        isSoldOut: true,
      };
      const responseData = await apiClient.put(`shop-owner/food/${id}/status`, payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log('>>> error', error);
    }
  };

  const handleUpdateProduct = async (id: number) => {
    try {
      const responseData = await apiClient.get(`shop-owner/food/${id}/detail`);
      if (responseData.data.isSuccess) {
        setProductDetail(responseData.data.value);
        onProductUpdateOpen(); // Open the update modal with the fetched data
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa món ăn này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const responseData = await apiClient.delete(`shop-owner/food/${id}`);
        if (responseData.data.isSuccess) {
          toast('success', responseData.data.value.message);
          setIsRefetch();
        } else {
          toast('error', responseData.data.error.message);
        }
      }
    });
  };

  const openProductDetail = (id: number) => {
    router.push(`products/${id}`);
  };

  /**
   * Option group action
   */

  const handleDisableOption = async (id: number, numberOfLinked: number) => {
    if (numberOfLinked) {
      await Swal.fire({
        text: `Lựa chọn này đang có ${numberOfLinked} món ăn liên kết. Bạn có muốn ẩn những sản phẩm liên kết đến không?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const responseData = await apiClient.put(`shop-owner/option-group/${id}/status`, {
              status: 2,
            });
            console.log(responseData.data, 'responseData.data');
            if (responseData.data.isSuccess) {
              setIsRefetch();
              toast('success', responseData.data.value.message);
            } else {
              toast('error', responseData.data.error.message);
            }
          } catch (error: any) {
            console.log(error);
          }
        } else {
          return;
        }
      });
    } else {
      try {
        const responseData = await apiClient.put(`shop-owner/option-group/${id}/status`, {
          status: 2,
        });
        console.log(responseData.data, 'responseData.data');
        if (responseData.data.isSuccess) {
          setIsRefetch();
          toast('success', responseData.data.value.message);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };
  const handleEnableOption = async (id: number) => {
    try {
      const responseData = await apiClient.put(`shop-owner/option-group/${id}/status`, {
        status: 1,
      });
      console.log(responseData.data, 'responseData.data');
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleUpdateOption = async (id: number) => {
    try {
      const responseData = await apiClient.get(`shop-owner/option-group/${id}`);
      if (responseData.data.isSuccess) {
        setOptionGroupDetail(responseData.data.value);
        onOptionGroupUpdateOpen();
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };
  const handleDeleteOption = async (id: number) => {
    try {
      const responseData = await apiClient.delete(`shop-owner/option-group/${id}`, {
        data: {
          id: id,
          isConfirm: false,
        },
      });

      if (responseData.data.isWarning) {
        await Swal.fire({
          text: responseData.data.value.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Hủy',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const responseData = await apiClient.delete(`shop-owner/option-group/${id}`, {
              data: {
                id: id,
                isConfirm: true,
              },
            });
            if (responseData.data.isSuccess) {
              toast('success', responseData.data.value.message);
              setIsRefetch();
            } else {
              toast('error', responseData.data.error.message);
            }
          } else {
            return;
          }
        });
      } else if (responseData.data.isSuccess) {
        toast('success', responseData.data.value.message);
        setIsRefetch();
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log('>>> error', error);
    }
  };

  const handleAddNewOptionGroup = () => {
    onOptionGroupCreateOpen();
  };

  const initQuery = {
    pageIndex: 1,
    pageSize: 10,
  };

  const initProductQuery = {
    ...initQuery,
    name: '',
    statusMode: 0,
  } as ProductQuery;

  const initOptionQuery = {
    ...initQuery,
    title: '',
    status: 0,
  } as OptionGroupQuery;
  const [productQuery, setProductQuery] = useState<ProductQuery>(initProductQuery);

  const [optionGroupQuery, setOptionGroupQuery] = useState<OptionGroupQuery>(initOptionQuery);

  const { data: products, refetch: refetchProducts } = useFetchWithRQ<ProductModel, ProductQuery>(
    REACT_QUERY_CACHE_KEYS.PRODUCTS,
    productApiService,
    productQuery,
  );

  const { data: optionList, refetch: refetchOptions } = useFetchWithRQ<
    OptionGroupModel,
    OptionGroupQuery
  >(REACT_QUERY_CACHE_KEYS.OPTIONS, optionApiService, optionGroupQuery);

  useEffect(() => {
    if (isActiveTab === 1) {
      refetchProducts();
    } else {
      refetchOptions();
    }
  }, [isRefetch, isActiveTab]);

  useEffect(() => {
    setProductStatuses(new Set(['0']));
    setOptionStatuses(new Set(['0']));
    setProductQuery(initProductQuery);
    setOptionGroupQuery(initOptionQuery);
  }, [isActiveTab]);

  const statusFilterProducts = [{ key: 0, desc: 'Tất cả' }].concat(
    PRODUCT_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
  );

  const filterProducts = {
    label: 'Trạng thái',
    mappingField: 'status',
    selectionMode: 1,
    options: statusFilterProducts,
    selectedValues: productStatuses,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setProductStatuses(values);
      setProductQuery({ ...productQuery, statusMode: value });
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
    selectedValues: optionStatuses,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setOptionStatuses(values);
      setOptionGroupQuery({ ...optionGroupQuery, status: value });
    },
  } as TableCustomFilter;

  const productTable = useCallback((product: ProductModel, columnKey: React.Key): ReactNode => {
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
      case 'numberOfOptionGroupLinked':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatNumber(product.numberOfOptionGroupLinked)}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              product.status === 1 && !product.isSoldOut
                ? 'bg-green-200 text-green-600'
                : product.status === 1 && product.isSoldOut
                  ? 'bg-red-200 text-rose-600'
                  : 'bg-gray-200 text-gray-600'
            }`}
            size="sm"
            variant="flat"
          >
            {product.status === 1 && !product.isSoldOut
              ? 'Đang mở bán'
              : product.status === 1 && product.isSoldOut
                ? 'Tạm hết hàng'
                : 'Đã tạm ẩn'}
          </Chip>
        );
      case 'slot':
        return (
          <div className="flex flex-col">
            <ul className="text-small">
              {product.operatingSlots.map((slot) => (
                <li key={slot.id}>{slot.timeFrameFormat}</li>
              ))}
            </ul>
          </div>
        );
      case 'shopCategory':
        return (
          <div className="flex flex-col">
            <p className="text-small">{product?.shopCategory?.name}</p>
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
                {product.status === 2 ? (
                  <DropdownItem onClick={() => handleActiveProduct(product.id)}>
                    Mở bán lại
                  </DropdownItem>
                ) : (
                  <DropdownItem onClick={() => handleDisableProduct(product.id)}>
                    Tạm ẩn
                  </DropdownItem>
                )}
                {product.status === 1 && !product.isSoldOut ? (
                  <DropdownItem onClick={() => handleSoldOutProduct(product.id)}>
                    Tạm hết hàng
                  </DropdownItem>
                ) : product.status === 1 && product.isSoldOut ? (
                  <DropdownItem onClick={() => handleActiveProduct(product.id)}>
                    Mở bán lại
                  </DropdownItem>
                ) : (
                  <DropdownItem className="hidden" />
                )}

                {product.status === 1 && !product.isSoldOut ? (
                  <DropdownItem className="hidden" />
                ) : product.status === 1 && product.isSoldOut ? (
                  <DropdownItem onClick={() => handleUpdateProduct(product.id)}>
                    Sửa món ăn
                  </DropdownItem>
                ) : (
                  <DropdownItem onClick={() => handleUpdateProduct(product.id)}>
                    Sửa món ăn
                  </DropdownItem>
                )}

                <DropdownItem onClick={() => handleDeleteProduct(product.id)}>
                  Xóa món ăn
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        break;
    }
  }, []);

  const optionTable = useCallback((option: OptionGroupModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">{option.id}</p>
          </div>
        );
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-small">{option.title}</p>
          </div>
        );
      case 'numOfItemLinked':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatNumber(option.numOfItemLinked)}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              option.status === 1 ? 'bg-green-200 text-green-600' : 'bg-red-200 text-rose-600'
            }`}
            size="sm"
            variant="flat"
          >
            {OPTION_GROUP_STATUS.find((item) => item.key == option.status)?.desc}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatDate(option.createdDate)}</p>
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
                {option.status === 1 ? (
                  <DropdownItem
                    onClick={() => handleDisableOption(option.id, option.numOfItemLinked)}
                  >
                    Tạm ẩn
                  </DropdownItem>
                ) : (
                  <DropdownItem onClick={() => handleEnableOption(option.id)}>
                    Hoạt động lại
                  </DropdownItem>
                )}
                {option.status === 1 ? (
                  <DropdownItem className="hidden" />
                ) : (
                  <DropdownItem onClick={() => handleUpdateOption(option.id)}>
                    Sửa lựa chọn
                  </DropdownItem>
                )}
                <DropdownItem onClick={() => handleDeleteOption(option.id)}>
                  Xóa lựa chọn
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        break;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={2}>
      <div className="md:col-span-1 pb-32">
        <Header title="Quản lý sản phẩm" />
      </div>

      <div className="flex fixed top-[72px] z-30 bg-white shadow-md py-2 left-[305px] w-[1209px] justify-around border-t-small">
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
        <>
          <TableCustom
            placeHolderSearch="Tìm kiếm thực đơn..."
            description="thực đơn"
            columns={PRODUCT_COLUMNS}
            arrayData={products?.value?.items ?? []}
            total={products?.value?.totalCount ?? 0}
            searchHandler={(value: string) => {
              setProductQuery({ ...productQuery, name: value });
            }}
            pagination={products?.value as PageableModel}
            goToPage={(index: number) => setProductQuery({ ...productQuery, pageIndex: index })}
            setPageSize={(size: number) => setProductQuery({ ...productQuery, pageSize: size })}
            selectionMode="single"
            filters={[filterProducts]}
            renderCell={productTable}
            handleRowClick={openProductDetail}
            handleAddNew={handleAddNewProduct}
          />
          <ProductCreateModal
            isOpen={isProductCreateOpen}
            onOpen={onProductCreateOpen}
            onOpenChange={onProductCreateOpenChange}
          />

          <ProductUpdateModal
            product={productDetail}
            isOpen={isProductUpdateOpen}
            onOpen={onProductUpdateOpen}
            onOpenChange={onProductUpdateOpenChange}
          />
        </>
      ) : (
        <>
          <TableCustom
            placeHolderSearch="Tìm kiếm nhóm lựa chọn..."
            description="nhóm lựa chọn"
            columns={OPTION_GROUP_COLUMNS}
            arrayData={optionList?.value?.items ?? []}
            total={optionList?.value?.totalCount ?? 0}
            searchHandler={(value: string) => {
              setOptionGroupQuery({ ...optionGroupQuery, title: value });
            }}
            pagination={optionList?.value as PageableModel}
            goToPage={(index: number) =>
              setOptionGroupQuery({ ...optionGroupQuery, pageIndex: index })
            }
            setPageSize={(size: number) =>
              setOptionGroupQuery({ ...optionGroupQuery, pageSize: size })
            }
            selectionMode="single"
            filters={[filterOptions]}
            renderCell={optionTable}
            handleAddNew={handleAddNewOptionGroup}
          />
          <OptionGroupCreateModal
            isOpen={isOptionGroupCreateOpen}
            onOpen={onOptionGroupCreateOpen}
            onOpenChange={onOptionGroupCreateOpenChange}
          />

          <OptionGroupUpdateModal
            optionGroup={optionGroupDetail}
            isOpen={isOptionGroupUpdateOpen}
            onOpen={onOptionGroupUpdateOpen}
            onOpenChange={onOptionGroupUpdateOpenChange}
          />
        </>
      )}
    </MainLayout>
  );
}
