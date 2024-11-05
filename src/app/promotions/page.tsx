'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { PROMOTION_COLUMNS, PROMOTION_STATUS, PROMOTION_TYPE } from '@/data/constants/constants';
import { samplePromotions } from '@/data/TestData';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import PageableModel from '@/types/models/PageableModel';
import PromotionModel from '@/types/models/PromotionModel';
import PromotionQuery from '@/types/queries/PromotionQuery';
import { formatDate } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from '@nextui-org/react';
import { ReactNode, useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Promotions() {
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [applyTypes, setApplyTypes] = useState<Selection>(new Set(['0']));

  const handleAddNewPromotion = async () => {
    alert('add new promotion');
  };

  const handleUpdate = async () => {
    // todo update promotion
  };

  const handleDelete = async () => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa khuyến mãi này không?',
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

  const [query, setQuery] = useState<PromotionQuery>({
    name: '',
    status: 1,
    type: 1,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as PromotionQuery);

  const promotions = samplePromotions.value.items;
  // const { data: promotions } = useFetchWithRQ<PromotionModel, PromotionQuery>(
  //   REACT_QUERY_CACHE_KEYS.PROMOTIONS,
  //   promotionApiService,
  //   query,
  // );

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
    mappingField: 'type',
    selectionMode: 1,
    options: applyTypeFilterOptions,
    selectedValues: applyTypes,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setApplyTypes(values);
      setQuery({ ...query, type: value, ...range });
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
      case 'type':
        return (
          <Chip
            className={`capitalize ${
              promotion.type === 1 ? 'bg-cyan-200 text-cyan-600' : 'bg-indigo-200 text-indigo-600'
            }`}
            size="sm"
            variant="flat"
          >
            {PROMOTION_TYPE.find((item) => item.key == promotion.type)?.desc}
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
            {PROMOTION_STATUS.find((item) => item.key == promotion.status)?.desc}
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
                <DropdownItem onClick={handleUpdate}>Sửa khuyến mãi</DropdownItem>
                <DropdownItem onClick={handleDelete}>Xóa khuyến mãi</DropdownItem>
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
        total={20}
        // arrayData={promotions?.value?.items ?? []}
        arrayData={promotions}
        searchHandler={(value: string) => {
          setQuery({ ...query, name: value });
        }}
        pagination={samplePromotions.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter, applyTypeFilter]}
        renderCell={renderCell}
        handleAddNew={handleAddNewPromotion}
      />
    </MainLayout>
  );
}
