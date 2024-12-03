import TableCustom from '@/components/common/TableCustom';
import { StaffAssignmentModal } from '@/components/order/StaffAssignmentModal';
import { PREPARING_ORDER_COLUMNS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { preparingOrderApiService } from '@/services/api-services/api-service-instances';
import OrderModel from '@/types/models/OrderModel';
import PageableModel from '@/types/models/PageableModel';
import OrderQuery from '@/types/queries/OrderQuery';
import { formatCurrency, formatPhoneNumber, getBangkokDate } from '@/utils/MyUtils';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import FrameModel from '@/types/models/FrameModel';
import DeliveryPackageModel from '@/types/models/DeliveryPackageModel';

export type Staff = {
  total: number;
  waiting: number;
  delivering: number;
  successful: number;
  failed: number;
  staffInfor: {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    avatarUrl?: string;
    isShopOwner: boolean;
  };
};

export default function AssignOrder({ queryPreparing }: { queryPreparing: OrderQuery }) {
  const { dateFrom, dateTo, ...filteredQuery } = queryPreparing;
  const [query, setQuery] = useState<OrderQuery>(filteredQuery as OrderQuery);
  const [isActiveTab, setIsActiveTab] = useState(1);
  const [frames, setFrames] = useState<FrameModel[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [deliveryPackages, setDeliveryPackages] = useState<DeliveryPackageModel>();
  const dateInBangkok = getBangkokDate();
  const { isRefetch } = useRefetch();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  const openOrderDetail = (id: number) => {
    router.push(`orders/${id}`);
  };

  const { data: orders, refetch } = useFetchWithRQ<OrderModel, OrderQuery>(
    REACT_QUERY_CACHE_KEYS.ORDERS,
    preparingOrderApiService(startTime, endTime, dateInBangkok),
    query,
  );

  const handleAssign = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    refetch();
  }, [startTime, endTime, query, isRefetch]);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const responseData = await apiClient.get(
          `shop-owner/delivery-package/time-frame/un-assign?IntendedReceiveDate=${dateInBangkok}`,
        );
        if (responseData.data.isSuccess) {
          const fetchedFrames = responseData.data.value.timeFrames;
          setFrames(fetchedFrames);
          if (fetchedFrames.length > 0) {
            setStartTime(fetchedFrames[0].startTime);
            setEndTime(fetchedFrames[0].endTime === 0 ? 2400 : fetchedFrames[0].endTime);
          }
        } else {
          console.log(responseData.data.error.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFrames();
  }, [dateInBangkok]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const responseData = await apiClient.get(
          `shop/shop-delivery-staff/available?IntendedReceiveDate=${dateInBangkok}&StartTime=${startTime}&EndTime=${endTime}`,
        );
        if (responseData.data.isSuccess) {
          setStaffList(responseData.data.value);
        } else {
          console.log(responseData.data.error.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaffs();
  }, [startTime, endTime, dateInBangkok]);

  useEffect(() => {
    const fetchDeliveryPackages = async () => {
      try {
        const responseData = await apiClient.get(
          `shop-owner/delivery-package-group?IntendedReceiveDate=${dateInBangkok}&StartTime=${startTime}&EndTime=${endTime}`,
        );
        if (responseData.data.isSuccess) {
          setDeliveryPackages(responseData.data.value);
        } else {
          console.log(responseData.data.error.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDeliveryPackages();
  }, [startTime, endTime, dateInBangkok, isRefetch]);

  const preparingOrdersCell = useCallback((order: OrderModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">MS-{order.id}</p>
          </div>
        );
      case 'customerName':
        return (
          <div className="flex flex-col">
            <p className="text-small capitalize">{order.customer.fullName}</p>
          </div>
        );
      case 'phoneNumber':
        return (
          <div className="flex flex-col">
            <p className="text-small capitalize">{formatPhoneNumber(order.customer.phoneNumber)}</p>
          </div>
        );
      case 'buildingName':
        return (
          <div className="flex flex-col">
            <p className="text-small capitalize">{order.buildingName}</p>
          </div>
        );
      case 'totalPrice':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatCurrency(order.totalPrice)}</p>
          </div>
        );
      case 'staff':
        return (
          <User
            avatarProps={{ radius: 'full', src: order?.shopDeliveryStaff?.avatarUrl, size: 'md' }}
            name={
              order?.shopDeliveryStaff?.isShopOwnerShip
                ? 'Tôi'
                : (order?.shopDeliveryStaff?.fullName ?? 'Chưa có người giao')
            }
            className="flex justify-start ml-8 gap-4 cursor-pointer"
            onClick={() => {
              handleAssign(order.id);
            }}
          />
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
                <DropdownItem onClick={() => openOrderDetail(order.id)}>Xem chi tiết</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        break;
    }
  }, []);

  return (
    <div className="mt-16">
      <div className="flex fixed top-[145px] z-30 bg-white shadow-md left-[305px] w-[1209px] justify-start border-t-small overflow-x-auto">
        {frames.map((frame, index) => (
          <div
            key={index}
            className={isActiveTab === index + 1 ? 'border-b-2 border-b-primary' : ''}
          >
            <Button
              onClick={() => {
                if (isActiveTab !== index + 1) {
                  setIsActiveTab(index + 1);
                }
                setStartTime(frame?.startTime);
                setEndTime(frame?.endTime === 0 ? 2400 : frame?.endTime);
              }}
              className={`${isActiveTab === index + 1 ? 'text-primary' : 'text-black'} w-[160px] bg-transparent text-lg font-medium rounded-full`}
            >
              {frame?.timeFrameFormat}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-8 py-6 overflow-x-scroll">
        {deliveryPackages?.deliveryPackageGroups?.map((packageGroup) => (
          <div
            key={packageGroup?.shopDeliveryStaff?.id}
            className="shadow-md bg-slate-100 rounded-md p-2 min-w-[320px]"
          >
            <p className="font-bold text-center text-primary mb-4 text-xl">
              {packageGroup?.shopDeliveryStaff?.isShopOwnerShip
                ? 'Tôi'
                : packageGroup?.shopDeliveryStaff?.fullName}
            </p>
            {packageGroup.orders &&
              packageGroup.orders.map((order) => (
                <Card
                  key={order.id}
                  className="max-w-[320px] rounded-md flex justify-center items-center mx-2 my-2"
                >
                  <CardHeader className="flex gap-3">
                    <p className="text-md m-auto font-bold">
                      MS-{order.id}{' '}
                      {order.status === 6 && (
                        <span className="text-orange-500">(Đang giao hàng)</span>
                      )}
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody className="flex justify-center">
                    <p>Tên khách hàng: {order?.customer?.fullName}</p>
                    <p>Số điện thoại: {order?.customer?.phoneNumber}</p>
                    <p>Địa chỉ nhận hàng: {order?.buildingName}</p>
                  </CardBody>
                </Card>
              ))}
          </div>
        ))}
        {deliveryPackages?.unassignOrders && deliveryPackages.unassignOrders.length > 0 && (
          <div className="shadow-md bg-slate-100 rounded-md p-2 min-w-[320px]">
            <p className="font-bold text-center text-primary mb-4 text-xl">Chưa có người giao</p>
            {deliveryPackages.unassignOrders.map((order) => (
              <Card
                key={order?.id}
                className="max-w-[320px] rounded-md flex justify-center items-center mx-2 my-2"
              >
                <CardHeader className="flex gap-3">
                  <p className="text-md m-auto font-bold">MS-{order.id}</p>
                </CardHeader>
                <Divider />
                <CardBody className="flex justify-center">
                  <p>Tên khách hàng: {order?.customer?.fullName}</p>
                  <p>Số điện thoại: {order?.customer?.phoneNumber}</p>
                  <p>Địa chỉ nhận hàng: {order?.buildingName}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <TableCustom
        placeHolderSearch="Tìm kiếm đơn hàng..."
        description="đơn hàng"
        total={orders?.value?.totalCount ?? 0}
        columns={PREPARING_ORDER_COLUMNS}
        arrayData={orders?.value?.items ?? []}
        searchHandler={(value: string) => {
          setQuery({ ...query, id: value, phoneNumber: value });
        }}
        pagination={orders?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        isFilter={false}
        renderCell={preparingOrdersCell}
      />

      <StaffAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffList={staffList}
        orderId={selectedOrderId}
      />
    </div>
  );
}
