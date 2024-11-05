import TableCustom from '@/components/common/TableCustom';
import { ASSIGN_COLUMNS, PREPARING_ORDER_COLUMNS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import useRefetch from '@/hooks/states/useRefetch';
import { assignOrderApiService } from '@/services/api-services/api-service-instances';
import OrderModel from '@/types/models/OrderModel';
import PackageModel from '@/types/models/PackageModel';
import PageableModel from '@/types/models/PageableModel';
import OrderQuery from '@/types/queries/OrderQuery';
import PackageQuery from '@/types/queries/PackageQuery';
import { formatDate, formatNumber, formatPhoneNumber, getBangkokDate } from '@/utils/MyUtils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function ManageAssign({ queryAssign }: { queryAssign: PackageQuery }) {
  const [query, setQuery] = useState<PackageQuery>(queryAssign);
  const [isActiveTab, setIsActiveTab] = useState(1);
  const [frames, setFrames] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [deliveryPackages, setDeliveryPackages] = useState([]);
  const dateInBangkok = getBangkokDate();
  const { isRefetch, setIsRefetch } = useRefetch();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  const openOrderDetail = (id: number) => {
    router.push(`orders/${id}`);
  };

  const { data: packages, refetch } = useFetchWithRQ<PackageModel, PackageQuery>(
    REACT_QUERY_CACHE_KEYS.PACKAGES,
    assignOrderApiService(dateInBangkok),
    query,
  );
  console.log(packages);

  const deliveryPackagesCell = useCallback((packages: any, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">MS-{packages.id}</p>
          </div>
        );
      case 'staff':
        return (
          <User
            avatarProps={{
              radius: 'full',
              src: packages?.shopDeliveryStaff?.avatarUrl,
              size: 'md',
            }}
            name={packages?.shopDeliveryStaff?.fullName ?? 'Chưa có người giao'}
            className="flex justify-start ml-8 gap-4 cursor-pointer"
          />
        );
      case 'phoneNumber':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {formatPhoneNumber(packages.customer.phoneNumber)}
            </p>
          </div>
        );
      case 'numberOfOrders':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {formatNumber(packages?.numberOfOrders)}
            </p>
          </div>
        );
      case 'frame':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{packages.timeFrameFormat}</p>
          </div>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(packages.createdDate)}</p>
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
                <DropdownItem onClick={() => openOrderDetail(packages.id)}>
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
    <div className="mt-24">
      <div className="flex fixed top-[145px] z-30 bg-white shadow-md py-2 left-[290px] w-[1222px] justify-around border-t-small overflow-x-auto">
        {[1, 2].map((tab) => (
          <div key={tab} className={isActiveTab === tab ? 'border-b-2 border-b-primary' : ''}>
            <Button
              onClick={() => {
                if (isActiveTab !== tab) {
                  setIsActiveTab(tab);
                }
              }}
              className={`${isActiveTab === tab ? 'text-primary' : 'text-black'} w-[245px] bg-transparent text-lg font-medium`}
            >
              {tab === 1 ? 'Các gói hàng đã tạo' : 'Gói hàng của bạn'}
            </Button>
          </div>
        ))}
      </div>

      {isActiveTab === 1 ? (
        <TableCustom
          placeHolderSearch="Tìm kiếm gói hàng..."
          description="gói hàng"
          total={packages?.value?.totalCount ?? 0}
          columns={ASSIGN_COLUMNS}
          arrayData={packages?.value?.items ?? []}
          searchHandler={(value: string) => {
            setQuery({ ...query, id: value });
          }}
          pagination={packages?.value as PageableModel}
          goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
          setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
          selectionMode="single"
          // filters={[statusFilter]}
          isFilter={false}
          renderCell={deliveryPackagesCell}
        />
      ) : (
        <TableCustom
          placeHolderSearch="Tìm kiếm đơn hàng..."
          description="đơn hàng"
          total={packages?.value?.totalCount ?? 0}
          columns={PREPARING_ORDER_COLUMNS}
          arrayData={packages?.value?.items ?? []}
          searchHandler={(value: string) => {
            setQuery({ ...query, id: value });
          }}
          pagination={packages?.value as PageableModel}
          goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
          setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
          selectionMode="single"
          // filters={[statusFilter]}
          isFilter={false}
          renderCell={deliveryPackagesCell}
        />
      )}
    </div>
  );
}
