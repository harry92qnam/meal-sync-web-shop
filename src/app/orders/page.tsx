'use client';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import { ORDER_COLUMNS, ORDER_STATUS } from '@/data/constants/constants';

import { sampleOrders } from '@/data/TestData';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import OrderModel from '@/types/models/OrderModel';
import PageableModel from '@/types/models/PageableModel';
import OrderQuery from '@/types/queries/OrderQuery';
import { formatCurrency, formatTimeToSeconds } from '@/utils/MyUtils';
import { Chip, Selection } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useState } from 'react';

export default function Orders() {
  const router = useRouter();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));

  const [query, setQuery] = useState<OrderQuery>({
    title: '',
    description: '',
    status: 0,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as OrderQuery);

  const orders = sampleOrders.value.items;
  // const { data: orders } = useFetchWithRQ<OrderModel, OrderQuery>(
  //   REACT_QUERY_CACHE_KEYS.ORDERS,
  //   orderApiService,
  //   query,
  // );

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    ORDER_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
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

  const openOrderDetail = (id: number) => {
    const order = orders.find((item) => item.id === id);
    if (!order) {
      router.push('/');
    }
    router.push('orders/order-detail');
  };

  const renderCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    const cellValue = order[columnKey as keyof OrderModel];

    switch (columnKey) {
      case 'orderId':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.id}</p>
          </div>
        );
      case 'shopName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.shopName}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.customerName}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              order.status == 1
                ? 'bg-green-200 text-green-600'
                : order.status == 2
                  ? 'bg-yellow-200 text-yellow-600'
                  : 'bg-red-200 text-rose-600'
            }`}
            // color={STATUS_COLOR_MAP[order.status]}
            size="sm"
            variant="flat"
          >
            {ORDER_STATUS.find((item) => item.key == order.status)?.desc}
          </Chip>
        );
      case 'price':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatCurrency(order.price)}</p>
          </div>
        );
      case 'orderDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.orderDate)}</p>
          </div>
        );
      default:
        return cellValue.toString();
    }
  }, []);

  return (
    <div>
      <TableCustom
        indexPage={1}
        title="Quản lý giao dịch"
        placeHolderSearch="Tìm kiếm theo tên khách hàng..."
        description="giao dịch"
        columns={ORDER_COLUMNS}
        // arrayData={orders?.value?.items ?? []}
        arrayData={orders}
        searchHandler={(value: string) => {
          setQuery({ ...query, title: value });
        }}
        pagination={sampleOrders.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        filters={[statusFilter]}
        renderCell={renderCell}
        handleRowClick={openOrderDetail}
      />
    </div>
  );
}
