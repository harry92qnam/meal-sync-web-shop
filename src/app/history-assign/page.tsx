'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import HistoryAssignDetail from '@/components/history-assign/HistoryAssignDetail';
import MainLayout from '@/components/layout/MainLayout';
import { HISTORY_ASSIGN_COLUMNS, HISTORY_ASSIGN_STATUS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import useRefetch from '@/hooks/states/useRefetch';
import { historyAssignApiService } from '@/services/api-services/api-service-instances';
import HistoryAssignModel from '@/types/models/HistoryAssignModel';
import PageableModel from '@/types/models/PageableModel';
import HistoryAssignQuery from '@/types/queries/HistoryAssignQuery';
import { formatDate, formatNumber } from '@/utils/MyUtils';
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
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function HistoryAssign() {
  const { isRefetch } = useRefetch();
  const { range } = usePeriodTimeFilterState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [selectedDeliveryPackageId, setSelectedDeliveryPackageId] = useState<number>();

  const handleOpenDetail = (id: number) => {
    setIsModalOpen(true);
    setSelectedDeliveryPackageId(id);
  };

  const [query, setQuery] = useState<HistoryAssignQuery>({
    searchValue: '',
    statusMode: 0,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as HistoryAssignQuery);

  const [customQuery, setCustomQuery] = useState<any>({});

  useEffect(() => {
    const { dateFrom, dateTo, ...rest } = query;
    setCustomQuery({
      ...rest,
      dateFrom: dateFrom?.toISOString().split('T')[0],
      dateTo: dateTo?.toISOString().split('T')[0],
    });
  }, [query]);

  const { data: packages, refetch } = useFetchWithRQ<HistoryAssignModel, HistoryAssignQuery>(
    REACT_QUERY_CACHE_KEYS.HISTORY_ASSIGN,
    historyAssignApiService,
    customQuery,
  );

  useEffect(() => {
    setQuery(
      (prevQuery) =>
        ({
          ...prevQuery,
          ...range,
        }) as HistoryAssignQuery,
    );
  }, [range]);

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    HISTORY_ASSIGN_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
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
      setQuery({ ...query, statusMode: value, ...range });
    },
  } as TableCustomFilter;

  const renderCell = useCallback(
    (packages: HistoryAssignModel, columnKey: React.Key): ReactNode => {
      switch (columnKey) {
        case 'id':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">DP-{packages.id}</p>
            </div>
          );
        case 'shopDeliveryStaff':
          return (
            <User
              avatarProps={{ radius: 'full', src: packages?.shopDeliveryStaff?.avatarUrl }}
              name={packages?.shopDeliveryStaff?.fullName}
              className="flex justify-start ml-12 gap-4"
            />
          );
        case 'numberOfOrders':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{formatNumber(packages.orders?.length)}</p>
            </div>
          );
        case 'buildingName':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{packages?.orders?.[0]?.buildingName}</p>
            </div>
          );
        case 'timeFrameFormat':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small text-center">{packages.timeFrameFormat}</p>
            </div>
          );
        case 'intenededReceiveDate':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small text-center">
                {formatDate(packages.intenededReceiveDate)}
              </p>
            </div>
          );
        case 'status':
          return (
            <Chip
              className={`capitalize ${
                packages.status === 1 ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'
              }`}
              size="sm"
              variant="flat"
            >
              {HISTORY_ASSIGN_STATUS.find((item) => item.key === packages.status)?.desc}
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
                  <DropdownItem onClick={() => handleOpenDetail(packages.id)}>
                    Xem chi tiết
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          break;
      }
    },
    [],
  );

  return (
    <MainLayout activeContentIndex={9}>
      <div className="md:col-span-1 pb-16">
        <Header title="Lịch sử phân công" />
      </div>
      <div className="flex justify-end mb-2">
        <DateRangeFilter />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm gói hàng..."
        description="gói hàng"
        columns={HISTORY_ASSIGN_COLUMNS}
        total={packages?.value.totalCount ?? 0}
        arrayData={packages?.value?.items ?? []}
        searchHandler={(value: string) => {
          const updatedValue = value.toLocaleLowerCase().startsWith('dp-') ? value.slice(3) : value;
          setQuery({ ...query, searchValue: updatedValue });
        }}
        pagination={packages?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter]}
        renderCell={renderCell}
        handleRowClick={handleOpenDetail}
      />
      <HistoryAssignDetail
        id={selectedDeliveryPackageId as number}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
}
