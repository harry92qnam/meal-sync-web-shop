'use client';
import DateRangeFilter, { dateToDateValue } from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { REPORT_COLUMNS, REPORT_STATUS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import useRefetch from '@/hooks/states/useRefetch';
import { reportApiService } from '@/services/api-services/api-service-instances';
import PageableModel from '@/types/models/PageableModel';
import ReportModel from '@/types/models/ReportModel';
import ReportQuery from '@/types/queries/ReportQuery';
import { formatTimeToSeconds } from '@/utils/MyUtils';
import { Chip, Selection } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export default function Reports() {
  const router = useRouter();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const { isRefetch } = useRefetch();

  const [query, setQuery] = useState<ReportQuery>({
    searchValue: '',
    status: 0,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as ReportQuery);

  const { data: reports, refetch } = useFetchWithRQ<ReportModel, ReportQuery>(
    REACT_QUERY_CACHE_KEYS.REPORTS,
    reportApiService,
    query,
  );

  useEffect(() => {
    setQuery(
      (prevQuery) =>
        ({
          ...prevQuery,
          ...range,
        }) as ReportQuery,
    );
  }, [range]);

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    REPORT_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
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

  const openReportDetail = (id: number) => {
    router.push(`reports/${id}`);
  };

  const renderCell = useCallback((report: ReportModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">RP-{report.id}</p>
          </div>
        );
      case 'orderId':
        return (
          <div className="flex flex-col">
            <p className="text-small">MS-{report.orderId}</p>
          </div>
        );
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-small">{report.title}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-small">{report.customer.fullName}</p>
          </div>
        );
      case 'content':
        return (
          <div className="flex flex-col">
            <p className="text-small">{report.content}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              report.status === 1
                ? 'bg-gray-200 text-gray-600'
                : report.status === 2
                  ? 'bg-red-200 text-rose-600'
                  : 'bg-green-200 text-green-600'
            }`}
            size="sm"
            variant="flat"
          >
            {REPORT_STATUS.find((item) => item.key == report.status)?.desc}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatTimeToSeconds(report.createdDate)}</p>
          </div>
        );
      default:
        break;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={4}>
      <div className="md:col-span-1 pb-16">
        <Header title="Quản lý báo cáo" />
      </div>
      <div className="flex justify-end mb-2">
        <DateRangeFilter />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm báo cáo..."
        description="báo cáo"
        columns={REPORT_COLUMNS}
        total={reports?.value?.totalCount ?? 0}
        arrayData={reports?.value?.items ?? []}
        searchHandler={(value: string) => {
          setQuery({ ...query, searchValue: value });
        }}
        pagination={reports?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter]}
        renderCell={renderCell}
        handleRowClick={openReportDetail}
      />
    </MainLayout>
  );
}
