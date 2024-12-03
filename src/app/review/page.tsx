'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { REVIEW_COLUMNS, REVIEW_STATUS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import useRefetch from '@/hooks/states/useRefetch';
import { reviewApiService } from '@/services/api-services/api-service-instances';
import PageableModel from '@/types/models/PageableModel';
import ReviewModel from '@/types/models/ReviewModel';
import ReviewQuery from '@/types/queries/ReviewQuery';
import { formatDate } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function Review() {
  const { isRefetch } = useRefetch();
  const router = useRouter();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));

  const [query, setQuery] = useState<ReviewQuery>({
    searchValue: '',
    statusMode: 0,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as ReviewQuery);

  const [customQuery, setCustomQuery] = useState<any>({});

  useEffect(() => {
    const { dateFrom, dateTo, ...rest } = query;
    setCustomQuery({
      ...rest,
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: dateTo.toISOString().split('T')[0],
    });
  }, [query]);

  const { data: reviews, refetch } = useFetchWithRQ<ReviewModel, ReviewQuery>(
    REACT_QUERY_CACHE_KEYS.REVIEW,
    reviewApiService,
    customQuery,
  );

  const handleViewDetail = (id: number) => {
    router.push(`review/${id}`);
  };

  useEffect(() => {
    setQuery(
      (prevQuery) =>
        ({
          ...prevQuery,
          ...range,
        }) as ReviewQuery,
    );
  }, [range]);

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    REVIEW_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
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

  const renderCell = useCallback((review: ReviewModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">RV-{review.id}</p>
          </div>
        );
      case 'orderId':
        return (
          <div className="flex flex-col">
            <p className="text-small text-center">MS-{review.orderId}</p>
          </div>
        );
      case 'customerName':
        return (
          <User
            avatarProps={{ radius: 'full', src: review.customer.avatarUrl }}
            name={review.customer.fullName}
            className="flex justify-start ml-24 gap-4"
          />
        );
      case 'comment':
        return (
          <div className="flex flex-col">
            <p className="text-small">{review.comment}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              review.isAllowShopReply ? 'bg-gray-200 text-gray-600' : 'bg-green-200 text-green-600'
            }`}
            size="sm"
            variant="flat"
          >
            {review.isAllowShopReply ? 'Chưa phản hồi' : 'Đã phản hồi'}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatDate(review.createdDate)}</p>
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
                <DropdownItem onClick={() => handleViewDetail(review.orderId)}>
                  Xem chi tiết
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
    <MainLayout activeContentIndex={8}>
      <div className="md:col-span-1 pb-20">
        <Header title="Đánh giá sản phẩm" />
      </div>
      <div className="flex justify-end mb-2">
        <DateRangeFilter />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm đánh giá..."
        description="đánh giá"
        columns={REVIEW_COLUMNS}
        arrayData={reviews?.value.items ?? []}
        total={reviews?.value?.totalCount ?? 0}
        searchHandler={(value: string) => {
          const updatedValue =
            value.toLocaleLowerCase().startsWith('ms-') ||
            value.toLocaleLowerCase().startsWith('rv-')
              ? value.slice(3)
              : value;
          setQuery({ ...query, searchValue: updatedValue });
        }}
        pagination={reviews?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter]}
        renderCell={renderCell}
        // handleRowClick={openReviewDetail}
      />
    </MainLayout>
  );
}
