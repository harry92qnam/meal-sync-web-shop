'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import PromotionCreateModal from '@/components/promotion/PromotionCreateModal';
import PromotionUpdateModal from '@/components/promotion/PromotionUpdateModal';
import { PROMOTION_COLUMNS, PROMOTION_STATUS, PROMOTION_TYPE } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { promotionApiService } from '@/services/api-services/api-service-instances';
import PageableModel from '@/types/models/PageableModel';
import PromotionModel from '@/types/models/PromotionModel';
import PromotionQuery from '@/types/queries/PromotionQuery';
import { formatDate, toast } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Promotions() {
  const router = useRouter();
  const { isRefetch, setIsRefetch } = useRefetch();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [applyTypes, setApplyTypes] = useState<Selection>(new Set(['0']));
  const [promotionDetail, setPromotionDetail] = useState<PromotionModel | null>(null);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onOpenChange: onUpdateOpenChange,
  } = useDisclosure();

  const openPromotionDetail = async (id: number) => {
    router.push(`promotions/${id}`);
  };

  const handleAddNewPromotion = async () => {
    onCreateOpen();
  };

  const handleUpdate = async (id: number) => {
    try {
      const responseData = await apiClient.get(`shop-owner/promotion/${id}/detail`);

      if (responseData.data.isSuccess) {
        setPromotionDetail(responseData.data.value);
        onUpdateOpen();
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDisable = async (id: number) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn ẩn khuyến mãi này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            id,
            status: 2,
          };
          const responseData = await apiClient.put(`shop-owner/promotion/status/update`, payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', 'Tạm ẩn khuyến mãi thành công');
          } else {
            toast('error', responseData.data.error.message);
          }
        } catch (error: any) {
          console.log(error, '>>> error');
        }
      }
    });
  };

  const handleEnable = async (id: number) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn mở lại khuyến mãi này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            id,
            status: 1,
          };
          const responseData = await apiClient.put(`shop-owner/promotion/status/update`, payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', 'Mở lại khuyến mãi thành công');
          } else {
            toast('error', responseData.data.error.message);
          }
        } catch (error: any) {
          console.log(error, '>>> error');
        }
      }
    });
  };

  const handleDelete = async (id: number) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa khuyến mãi này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            id,
            status: 3,
          };
          const responseData = await apiClient.put(`shop-owner/promotion/status/update`, payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', 'Đã xóa khuyến mãi thành công');
          } else {
            toast('error', responseData.data.error.message);
          }
        } catch (error: any) {
          console.log(error, '>>> error');
        }
      }
    });
  };

  const [query, setQuery] = useState<PromotionQuery>({
    searchValue: '',
    status: 0,
    applyType: 0,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as PromotionQuery);

  const { data: promotions, refetch } = useFetchWithRQ<PromotionModel, PromotionQuery>(
    REACT_QUERY_CACHE_KEYS.PROMOTIONS,
    promotionApiService,
    query,
  );

  useEffect(() => {
    setQuery(
      (prevQuery) =>
        ({
          ...prevQuery,
          ...range,
        }) as PromotionQuery,
    );
  }, [range]);

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    PROMOTION_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
  );

  const applyTypeFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    PROMOTION_TYPE.map((item) => ({ key: item.key, desc: item.desc })),
  );

  const statusFilter = {
    label: 'Trạng thái',
    mappingField: 'status',
    selectionMode: 1,
    options: statusFilterOptions,
    selectedValues: statuses,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setStatuses(values);
      setQuery({ ...query, status: value, ...range });
    },
  } as TableCustomFilter;

  const applyTypeFilter = {
    label: 'Loại áp dụng',
    mappingField: 'applyType',
    selectionMode: 1,
    options: applyTypeFilterOptions,
    selectedValues: applyTypes,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setApplyTypes(values);
      setQuery({ ...query, applyType: value, ...range });
    },
  } as TableCustomFilter;

  const renderCell = useCallback((promotion: PromotionModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{promotion.id}</p>
          </div>
        );
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{promotion.title}</p>
          </div>
        );
      case 'startDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(promotion.startDate)}</p>
          </div>
        );
      case 'endDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(promotion.endDate)}</p>
          </div>
        );
      case 'applyType':
        return (
          <Chip
            className={`capitalize ${
              promotion.applyType === 1
                ? 'bg-cyan-200 text-cyan-600'
                : 'bg-indigo-200 text-indigo-600'
            }`}
            size="sm"
            variant="flat"
          >
            {PROMOTION_TYPE.find((item) => item.key == promotion.applyType)?.desc}
          </Chip>
        );
      case 'numberOfUsed':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small text-center">{promotion.numberOfUsed}</p>
          </div>
        );
      case 'usageLimit':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small text-center">{promotion.usageLimit}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              promotion.status === 1 ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'
            }`}
            size="sm"
            variant="flat"
          >
            {promotion.status === 1 ? 'Khả dụng' : 'Đã tạm ẩn'}
          </Chip>
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
                {promotion.status === 1 ? (
                  <DropdownItem onClick={() => handleDisable(promotion.id)}>Tạm ẩn</DropdownItem>
                ) : (
                  <DropdownItem onClick={() => handleEnable(promotion.id)}>Bỏ tạm ẩn</DropdownItem>
                )}
                <DropdownItem onClick={() => handleUpdate(promotion.id)}>
                  Sửa khuyến mãi
                </DropdownItem>
                <DropdownItem onClick={() => handleDelete(promotion.id)}>
                  Xóa khuyến mãi
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
    <MainLayout activeContentIndex={5}>
      <div className="md:col-span-1 pb-16">
        <Header title="Quản lý khuyến mãi" />
      </div>
      <div className="flex justify-end mb-2">
        <DateRangeFilter />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm khuyến mãi..."
        description="khuyến mãi"
        columns={PROMOTION_COLUMNS}
        total={promotions?.value.totalCount ?? 0}
        arrayData={promotions?.value?.items ?? []}
        searchHandler={(value: string) => {
          setQuery({ ...query, searchValue: value });
        }}
        pagination={promotions?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter, applyTypeFilter]}
        renderCell={renderCell}
        handleAddNew={handleAddNewPromotion}
        handleRowClick={openPromotionDetail}
      />
      <PromotionCreateModal
        isOpen={isCreateOpen}
        onOpen={onCreateOpen}
        onOpenChange={onCreateOpenChange}
      />

      <PromotionUpdateModal
        promotion={promotionDetail}
        isOpen={isUpdateOpen} // Control visibility of the update modal
        onOpen={onUpdateOpen}
        onOpenChange={onUpdateOpenChange}
      />
    </MainLayout>
  );
}
