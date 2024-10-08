'use client';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { REPORT_COLUMNS, REPORT_STATUS } from '@/data/constants/constants';
import { sampleReports } from '@/data/TestData';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import PageableModel from '@/types/models/PageableModel';
import ReportModel from '@/types/models/ReportModel';
import ReportQuery from '@/types/queries/ReportQuery';
import { formatTimeToSeconds } from '@/utils/MyUtils';
import { Chip, Selection } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useState } from 'react';

export default function Orders() {
  const router = useRouter();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));

  const [query, setQuery] = useState<ReportQuery>({
    title: '',
    description: '',
    status: 0,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as ReportQuery);

  const reports = sampleReports.value.items;
  // const { data: reports } = useFetchWithRQ<ReportModel, ReportQuery>(
  //   REACT_QUERY_CACHE_KEYS.REPORTS,
  //   reportApiService,
  //   query,
  // );

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
    const report = reports.find((item) => item.id === id);
    if (!report) {
      router.push('/');
    }
    router.push('reports/report-detail');
  };

  const renderCell = useCallback((report: ReportModel, columnKey: React.Key): ReactNode => {
    const cellValue = report[columnKey as keyof ReportModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{report.id}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{report.customerId}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              report.status === 1 ? 'bg-gray-200 text-gray-600' : 'bg-green-200 text-green-600'
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
            <p className="text-bold text-small">{formatTimeToSeconds(report.createdDate)}</p>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={2}>
      <div className="md:col-span-1 pb-24">
        <Header title="Quản lý đơn hàng" />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm báo cáo..."
        description="báo cáo"
        columns={REPORT_COLUMNS}
        // arrayData={reports?.value?.items ?? []}
        arrayData={reports}
        searchHandler={(value: string) => {
          setQuery({ ...query, title: value });
        }}
        pagination={sampleReports.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        isFilter={true}
        filters={[statusFilter]}
        renderCell={renderCell}
        handleRowClick={openReportDetail}
      />
    </MainLayout>
  );
}
