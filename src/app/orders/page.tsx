'use client';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import AssignOrder from '@/components/order/AssignOrder';
import ManageAssign from '@/components/order/ManageAssign';
import {
  CONFIRMED_ORDER_COLUMNS,
  DELIVERING_ORDER_COLUMNS,
  DELIVERY_STATUS,
  HISTORY_ORDER_COLUMNS,
  INCOMING_ORDER_COLUMNS,
  ORDER_STATUS,
} from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';

import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { orderApiService } from '@/services/api-services/api-service-instances';
import OrderModel from '@/types/models/OrderModel';
import PageableModel from '@/types/models/PageableModel';
import OrderQuery from '@/types/queries/OrderQuery';
import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  formatTimeFrame,
  formatTimeToSeconds,
  getBangkokDate,
  toast,
} from '@/utils/MyUtils';
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
import Swal from 'sweetalert2';

export default function Orders() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { range } = usePeriodTimeFilterState();
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [isActiveTab, setIsActiveTab] = useState(1);
  const { isRefetch, setIsRefetch } = useRefetch();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<number[]>([1]);
  const [rejectOrderId, setRejectOrderId] = useState<number>(0);

  const [query, setQuery] = useState<OrderQuery>({
    id: '',
    phoneNumber: '',
    status: [0],
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as OrderQuery);

  const [customQuery, setCustomQuery] = useState<any>({});
  useEffect(() => {
    if (
      status.includes(6) ||
      status.includes(7) ||
      status.includes(8) ||
      status.includes(3) ||
      status.includes(1)
    ) {
      const { dateFrom, dateTo, ...rest } = query;
      setCustomQuery({
        ...rest,
        IntendedReceiveDate: getBangkokDate(),
      });
    } else {
      setCustomQuery(query);
    }
  }, [query, status]);

  const statusFilterOptions =
    isActiveTab === 5
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
    let statusArray: number[] = [];
    switch (isActiveTab) {
      case 1:
        statusArray = [1];
        break;
      case 2:
        statusArray = [3];
        break;
      case 3:
        statusArray = [];
        break;
      case 4:
        statusArray = [];
        break;
      case 5:
        if (Number(Array.from(statusFilter.selectedValues)[0]) !== 0) {
          statusArray = [Number(Array.from(statusFilter.selectedValues)[0])];
        } else {
          statusArray = [6, 7, 8];
        }
        break;
      case 6:
        if (Number(Array.from(statusFilter.selectedValues)[0]) !== 0) {
          statusArray = [Number(Array.from(statusFilter.selectedValues)[0])];
        } else {
          statusArray = [2, 4, 9, 10, 11, 12];
        }
        break;
      default:
        statusArray = [1];
        break;
    }
    setStatus(statusArray);
  }, [isActiveTab, statusFilter.selectedValues]);

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      // status,
      pageIndex: 1,
      ...range,
    }));
  }, [status, range]);

  useEffect(() => {
    if (isActiveTab !== 3) {
      refetch();
    }
  }, [isRefetch]);

  const { data: orders, refetch } = useFetchWithRQ<OrderModel, OrderQuery>(
    REACT_QUERY_CACHE_KEYS.ORDERS,
    orderApiService(status),
    customQuery,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setReason(event.target.value);
  };

  // incoming orders
  const handleAcceptIncoming = async (id: number) => {
    try {
      const responseData = await apiClient.put(`shop-owner/order/${id}/confirm`);

      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };

  const handleConfirmRejectIncoming = async (onClose: () => void) => {
    if (!reason) {
      setError('Nhập lý do từ chối');
      return;
    }

    try {
      const payload = {
        reason,
      };
      const responseData = await apiClient.put(`shop-owner/order/${rejectOrderId}/reject`, payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log('>>> error', error);
    } finally {
      onClose();
    }
  };

  // confirmed orders
  const handleAcceptConfirmed = async (id: number) => {
    try {
      const responseData = await apiClient.put(`shop-owner/order/${id}/preparing`, {
        isConfirm: false,
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
            const responseData = await apiClient.put(`shop-owner/order/${id}/preparing`, {
              isConfirm: true,
            });
            if (responseData.data.isSuccess) {
              setIsRefetch();
              toast('success', responseData.data.value.message);
            } else {
              toast('error', responseData.data.error.message);
            }
          } else {
            return;
          }
        });
      } else if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };
  const handleConfirmRejectConfirmed = async (onClose: () => void) => {
    if (!reason) {
      setError('Nhập lý do từ chối');
      return;
    }
    try {
      const responseData = await apiClient.put(`shop-owner/order/${rejectOrderId}/cancel`, {
        reason,
        isConfirm: false,
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
            const responseData = await apiClient.put(`shop-owner/order/${rejectOrderId}/cancel`, {
              reason,
              isConfirm: true,
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
    } finally {
      onClose();
    }
  };

  const openOrderDetail = (id: number) => {
    router.push(`orders/${id}`);
  };

  const incomingOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">MS-{order.id}</p>
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
      case 'buildingName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.buildingName}</p>
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
            <p className="text-bold text-small">
              {formatTimeFrame(order.startTime, order.endTime)}
            </p>
          </div>
        );
      case 'orderDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.orderDate)}</p>
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
                <DropdownItem onClick={() => handleAcceptIncoming(order.id)}>Nhận đơn</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setRejectOrderId(order.id);
                    onOpen();
                  }}
                >
                  Từ chối
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        break;
    }
  }, []);

  const confirmedOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">MS-{order.id}</p>
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
      case 'buildingName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{order.buildingName}</p>
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
            <p className="text-bold text-small">
              {formatTimeFrame(order.startTime, order.endTime)}
            </p>
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
                <DropdownItem onClick={() => handleAcceptConfirmed(order.id)}>
                  Đang chuẩn bị
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setRejectOrderId(order.id);
                    onOpen();
                  }}
                >
                  Từ chối
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        break;
    }
  }, []);

  const deliveringOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">MS-{order.id}</p>
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
            <p className="text-bold text-small">
              {order?.shopDeliveryStaff?.isShopOwnerShip
                ? 'Tôi (tự giao)'
                : order?.shopDeliveryStaff?.fullName}
            </p>
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
      case 'orderDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(order.orderDate)}</p>
          </div>
        );
      default:
        break;
    }
  }, []);

  const historyOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">MS-{order.id}</p>
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
      case 'intendedReceiveDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(order.intendedReceiveDate)}</p>
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

      <div
        className="flex fixed top-[72px] z-30 bg-white shadow-md py-2 left-[305px] justify-between border-t-small overflow-x-auto"
        style={{ width: `calc(100% - 320px)` }}
      >
        {[1, 2, 3, 4, 5, 6].map((tab) => (
          <div
            key={tab}
            className={
              isActiveTab === tab
                ? 'border-b-2 border-b-primary flex-1 flex flex-row items-center justify-center'
                : 'flex-1 flex flex-row items-center justify-center'
            }
          >
            <Button
              onClick={() => {
                if (isActiveTab !== tab) {
                  setIsActiveTab(tab);
                }
              }}
              className={`${isActiveTab === tab ? 'text-primary' : 'text-black'} w-[245px] bg-transparent text-lg font-medium text-center`}
            >
              {tab === 1
                ? 'Đơn mới'
                : tab === 2
                  ? 'Đã xác nhận'
                  : tab === 3
                    ? 'Đang chuẩn bị'
                    : tab === 4
                      ? 'Quản lý phân công'
                      : tab === 5
                        ? 'Giao hàng'
                        : 'Lịch sử đơn hàng'}
            </Button>
          </div>
        ))}
      </div>

      {isActiveTab === 1 ? (
        <div className="mt-10">
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            total={orders?.value?.totalCount ?? 0}
            columns={INCOMING_ORDER_COLUMNS}
            arrayData={orders?.value.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, id: value, phoneNumber: value });
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
                    <Button color="primary" onClick={() => handleConfirmRejectIncoming(onClose)}>
                      Xác nhận
                    </Button>
                  </ModalFooter>
                </React.Fragment>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : isActiveTab === 2 ? (
        <div className="mt-10">
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            total={orders?.value?.totalCount ?? 0}
            columns={CONFIRMED_ORDER_COLUMNS}
            arrayData={orders?.value?.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, id: value, phoneNumber: value });
            }}
            pagination={orders?.value as PageableModel}
            goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
            setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
            selectionMode="single"
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
                    <Button color="primary" onClick={() => handleConfirmRejectConfirmed(onClose)}>
                      Xác nhận
                    </Button>
                  </ModalFooter>
                </React.Fragment>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : isActiveTab === 3 ? (
        <AssignOrder queryPreparing={query} />
      ) : isActiveTab === 4 ? (
        <ManageAssign queryAssign={query} />
      ) : isActiveTab === 5 ? (
        <div className="mt-10">
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            total={orders?.value?.totalCount ?? 0}
            columns={DELIVERING_ORDER_COLUMNS}
            arrayData={orders?.value?.items ?? []}
            searchHandler={(value: string) => {
              setQuery({ ...query, id: value });
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
          <div className="mt-10 flex justify-end mb-2">
            <DateRangeFilter />
          </div>
          <TableCustom
            placeHolderSearch="Tìm kiếm đơn hàng..."
            description="đơn hàng"
            columns={HISTORY_ORDER_COLUMNS}
            arrayData={orders?.value?.items ?? []}
            total={orders?.value?.totalCount ?? 0}
            searchHandler={(value: string) => {
              setQuery({ ...query, id: value, phoneNumber: value });
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
