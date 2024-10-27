'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import {
  CONFIRMED_ORDER_COLUMNS,
  DELIVERING_ORDER_COLUMNS,
  HISTORY_ORDER_COLUMNS,
  INCOMING_ORDER_COLUMNS,
  DELIVERY_STATUS,
  ORDER_STATUS,
} from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';

import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import { orderApiService } from '@/services/api-services/api-service-instances';
import OrderModel from '@/types/models/OrderModel';
import PageableModel from '@/types/models/PageableModel';
import OrderQuery from '@/types/queries/OrderQuery';
import { formatCurrency, formatPhoneNumber, formatTimeToSeconds } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function Orders() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [isActiveTab, setIsActiveTab] = useState(1);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<number[]>([1]);

  const [query, setQuery] = useState<OrderQuery>({
    name: '',
    description: '',
    status: [1],
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as OrderQuery);

  const statusFilterOptions =
    isActiveTab === 4
      ? [{ key: 0, desc: 'Tất cả' }].concat(
          DELIVERY_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
        )
      : [{ key: 0, desc: 'Tất cả' }].concat(
          ORDER_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
        );

  const statusFilter = {
    label: 'Trạng thái',
    mappingField: 'status',
    selectionMode: 1,
    options: statusFilterOptions,
    selectedValues: statuses,
    handleFunc: (values: Selection) => {
      const selectedStatuses = Array.from(values).map((val) => parseInt(val.toString()));
      setStatuses(values);
      setQuery((prevQuery) => ({ ...prevQuery, status: selectedStatuses, ...range }));
    },
  } as TableCustomFilter;

  useEffect(() => {
    let statusArray = [];
    switch (isActiveTab) {
      case 1:
        statusArray = [1];
        break;
      case 2:
        statusArray = [3];
        break;
      case 3:
        statusArray = [5];
        break;
      case 4:
        statusArray = [6, 7, 8];
        break;
      case 5:
        statusArray = [2, 4, 9, 10, 11, 12];
        break;
      default:
        statusArray = [1];
        break;
    }
    setStatus(statusArray);
  }, [isActiveTab]);

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      status,
      pageIndex: 1,
      ...range,
    }));
  }, [status, range]);

  const { data: orders } = useFetchWithRQ<OrderModel, OrderQuery>(
    REACT_QUERY_CACHE_KEYS.ORDERS,
    orderApiService(status),
    query,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setReason(event.target.value);
  };

  const handleReject = async (onClose: () => void) => {
    if (!reason) {
      setError('Nhập lý do từ chối');
      return;
    }
    onClose();
    // todo handle reject order
    // try {
    //   const payload = {
    //     reason,
    //   };

    //   if (responseData.data.isSuccess) {
    //     toast('success', responseData.data.value);
    //     onClose();
    //   } else {
    //     throw new Error(responseData.data.error.message);
    //   }
    // } catch (error) {
    //   toast('error', (error as any).response.data.error?.message);
    // }
  };

  const handleAccept = async () => {
    // todo handle accept order
  };

  const openOrderDetail = (id: number) => {
    // const order = orders?.value.items.find((item) => item.id === id);
    router.push(`orders/${id}`);
  };

  const incomingOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    const cellValue = order[columnKey as keyof OrderModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.id}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.customer.fullName}</p>
          </div>
        );
      case 'phoneNumber':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {formatPhoneNumber(order.customer.phoneNumber)}
            </p>
          </div>
        );
      case 'totalPrice':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatCurrency(order.totalPrice)}</p>
          </div>
        );
      case 'frame':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.timeFrameFormat}</p>
          </div>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.createdDate)}</p>
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
                <DropdownItem onClick={handleAccept}>Nhận đơn</DropdownItem>
                <DropdownItem onClick={onOpen}>Từ chối</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        break;
    }
  }, []);

  const confirmedOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    const cellValue = order[columnKey as keyof OrderModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.id}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.customer.fullName}</p>
          </div>
        );
      case 'phoneNumber':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {formatPhoneNumber(order.customer.phoneNumber)}
            </p>
          </div>
        );
      case 'totalPrice':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatCurrency(order.totalPrice)}</p>
          </div>
        );
      case 'frame':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.timeFrameFormat}</p>
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
                <DropdownItem onClick={handleAccept}>Đang chuẩn bị</DropdownItem>
                <DropdownItem onClick={onOpen}>Từ chối</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case 'confirmedDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.orderDate)}</p>
          </div>
        );
      default:
        break;
    }
  }, []);

  const deliveringOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    const cellValue = order[columnKey as keyof OrderModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.id}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.customer.fullName}</p>
          </div>
        );
      case 'staffName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order?.staff?.fullName ?? 'Tự giao'}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            // handle 3 statuses of delivery (pending, success and fail)
            className={`capitalize ${
              order.status == 6
                ? 'bg-yellow-200 text-yellow-600'
                : order.status == 7
                  ? 'bg-green-200 text-green-600'
                  : 'bg-red-200 text-rose-600'
            }`}
            size="sm"
            variant="flat"
          >
            {DELIVERY_STATUS.find((item) => item.key == order.status)?.desc}
          </Chip>
        );
      case 'totalPrice':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatCurrency(order.totalPrice)}</p>
          </div>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.createdDate)}</p>
          </div>
        );
      default:
        break;
    }
  }, []);

  const historyOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    const cellValue = order[columnKey as keyof OrderModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{order.id}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.customer.fullName}</p>
          </div>
        );
      case 'phoneNumber':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {formatPhoneNumber(order.customer.phoneNumber)}
            </p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              order.status == 2 || order.status == 4
                ? 'bg-red-200 text-rose-600'
                : order.status == 9
                  ? 'bg-green-200 text-green-600'
                  : order.status == 10
                    ? 'bg-gray-200 text-gray-600'
                    : order.status == 11
                      ? 'bg-yellow-200 text-yellow-600'
                      : 'bg-purple-200 text-purple-600'
            }`}
            size="sm"
            variant="flat"
          >
            {ORDER_STATUS.find((item) => item.key == order.status)?.desc}
          </Chip>
        );
      case 'totalPrice':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatCurrency(order.totalPrice)}</p>
          </div>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.createdDate)}</p>
          </div>
        );
      default:
        break;
    }
  }, []);

  return (
    <MainLayout activeContentIndex={1}>
      <div className="md:col-span-1 pb-24">
        <Header title="Quản lý đơn hàng" />
      </div>

      <div className="flex fixed top-[72px] z-50 bg-white shadow-md py-2 left-[290px] w-[1230px] justify-between border-t-small">
        {[1, 2, 3, 4, 5].map((tab) => (
          <div key={tab} className={isActiveTab === tab ? 'border-b-2 border-b-primary' : ''}>
            <Button
              onClick={() => {
                if (isActiveTab !== tab) {
                  setIsActiveTab(tab);
                }
              }}
              className={`${isActiveTab === tab ? 'text-primary' : 'text-black'} w-[245px] bg-transparent text-lg font-medium`}
            >
              {tab === 1
                ? 'Đơn mới'
                : tab === 2
                  ? 'Đã xác nhận'
                  : tab === 3
                    ? 'Đang chuẩn bị'
                    : tab === 4
                      ? 'Giao hàng'
                      : 'Lịch sử đơn hàng'}
            </Button>
          </div>
        ))}
      </div>

      {isActiveTab === 1 ? (
        <div className="mt-6">
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            columns={INCOMING_ORDER_COLUMNS}
            arrayData={orders?.value.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, name: value });
            }}
            pagination={orders?.value as PageableModel}
            goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
            setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
            selectionMode="multiple"
            isFilter={false}
            renderCell={incomingOrdersCell}
            handleRowClick={openOrderDetail}
          />

          <Modal
            isOpen={isOpen}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setReason('');
              }
              onOpenChange();
            }}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <React.Fragment>
                  <ModalHeader className="mx-auto">Lý do từ chối</ModalHeader>
                  <ModalBody>
                    <Textarea
                      size="lg"
                      placeholder="Nhập lý do"
                      variant="faded"
                      value={reason}
                      onChange={handleInputChange}
                    />
                    {error && <p className="text-sm text-danger-500">{error}</p>}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onClick={onClose}>
                      Đóng
                    </Button>
                    <Button color="primary" onClick={() => handleReject(onClose)}>
                      Xác nhận
                    </Button>
                  </ModalFooter>
                </React.Fragment>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : isActiveTab === 2 ? (
        <div className="mt-6">
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            columns={CONFIRMED_ORDER_COLUMNS}
            arrayData={orders?.value?.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, name: value });
            }}
            pagination={orders?.value as PageableModel}
            goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
            setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
            selectionMode="multiple"
            isFilter={false}
            renderCell={confirmedOrdersCell}
            handleRowClick={openOrderDetail}
          />

          <Modal
            isOpen={isOpen}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setReason('');
              }
              onOpenChange();
            }}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <React.Fragment>
                  <ModalHeader className="mx-auto">Lý do từ chối</ModalHeader>
                  <ModalBody>
                    <Textarea
                      size="lg"
                      placeholder="Nhập lý do"
                      variant="faded"
                      value={reason}
                      onChange={handleInputChange}
                    />
                    {error && <p className="text-sm text-danger-500">{error}</p>}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onClick={onClose}>
                      Đóng
                    </Button>
                    <Button color="primary" onClick={() => handleReject(onClose)}>
                      Xác nhận
                    </Button>
                  </ModalFooter>
                </React.Fragment>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : isActiveTab === 3 ? (
        <></>
      ) : // todo handle kanban board
      isActiveTab === 4 ? (
        <div className="mt-6">
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            columns={DELIVERING_ORDER_COLUMNS}
            arrayData={orders?.value?.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, name: value });
            }}
            pagination={orders?.value as PageableModel}
            goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
            setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
            filters={[statusFilter]}
            selectionMode="single"
            renderCell={deliveringOrdersCell}
            handleRowClick={openOrderDetail}
          />
        </div>
      ) : (
        <div>
          <div className="mt-6 flex justify-end mb-2">
            <DateRangeFilter />
          </div>
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            columns={HISTORY_ORDER_COLUMNS}
            arrayData={orders?.value?.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, name: value });
            }}
            pagination={orders?.value as PageableModel}
            goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
            setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
            filters={[statusFilter]}
            selectionMode="single"
            renderCell={historyOrdersCell}
            handleRowClick={openOrderDetail}
          />
        </div>
      )}
    </MainLayout>
  );
}
