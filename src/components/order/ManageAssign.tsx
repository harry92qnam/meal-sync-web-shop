import TableCustom from '@/components/common/TableCustom';
import { ALL_PACKAGES_COLUMNS, OWN_PACKAGES_COLUMNS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import useRefetch from '@/hooks/states/useRefetch';
import {
  allOrderApiService,
  ownerOrderApiService,
} from '@/services/api-services/api-service-instances';
import PackageModel from '@/types/models/PackageModel';
import PageableModel from '@/types/models/PageableModel';
import PackageQuery from '@/types/queries/PackageQuery';
import {
  formatDate,
  formatNumber,
  formatPhoneNumber,
  formatTimeFrame,
  getBangkokDate,
  getFormattedCurrentTime,
} from '@/utils/MyUtils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function ManageAssign({ queryAssign }: { queryAssign: PackageQuery }) {
  const { dateFrom, dateTo, ...filteredQuery } = queryAssign;
  const [query, setQuery] = useState<PackageQuery>(filteredQuery as PackageQuery);
  const [isActiveTab, setIsActiveTab] = useState(1);
  const dateInBangkok = getBangkokDate();
  const { isRefetch, setIsRefetch } = useRefetch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(0);
  const currentTime: number = getFormattedCurrentTime();

  const openOrderDetail = (id: number) => {
    router.push(`orders/${id}`);
  };

  const { data: allPackages, refetch: refetchAllPackages } = useFetchWithRQ<
    PackageModel,
    PackageQuery
  >(REACT_QUERY_CACHE_KEYS.PACKAGES, allOrderApiService(currentTime, dateInBangkok), query);

  const { data: ownerPackages, refetch: refetchOwnPackages } = useFetchWithRQ<
    PackageModel,
    PackageQuery
  >(REACT_QUERY_CACHE_KEYS.PACKAGES, ownerOrderApiService(currentTime, dateInBangkok), query);

  useEffect(() => {
    if (isActiveTab === 1) {
      refetchAllPackages();
    } else {
      refetchOwnPackages();
    }
  }, [isRefetch, isActiveTab, query]);

  const allPackagesCell = useCallback((packages: PackageModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">DP-{packages?.deliveryPackageId}</p>
          </div>
        );
      case 'shopDeliveryStaff':
        return (
          <User
            avatarProps={{
              radius: 'full',
              src: packages?.shopDeliveryStaff?.avatarUrl ?? '',
              size: 'md',
            }}
            name={
              packages.shopDeliveryStaff.isShopOwnerShip
                ? 'Tôi'
                : packages?.shopDeliveryStaff?.fullName
            }
            className="flex justify-start ml-8 gap-4 cursor-pointer"
          />
        );
      case 'numberOfOrders':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {formatNumber(packages?.orders.length)}
            </p>
          </div>
        );
      case 'frame':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {formatTimeFrame(packages?.orders[0]?.startTime, packages?.orders[0]?.endTime)}
            </p>
          </div>
        );
      case 'buildingName':
        return (
          <div className="flex flex-col">
            <ul className="text-small">
              {packages?.orders.map((order) => (
                <li key={order.buildingId}>{order.buildingName}</li>
              ))}
            </ul>
          </div>
        );
      case 'intendedReceiveDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(packages?.orders[0]?.intendedReceiveDate).toLocaleDateString('en-GB')}
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
                <DropdownItem onClick={() => openOrderDetail(packages?.deliveryPackageId)}>
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

  const ownerPackagesCell = useCallback(
    (packages: PackageModel, columnKey: React.Key): ReactNode => {
      switch (columnKey) {
        case 'id':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">DP-{packages?.deliveryPackageId}</p>
            </div>
          );
        case 'numberOfOrders':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {formatNumber(packages?.orders.length)}
              </p>
            </div>
          );
        case 'frame':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">
                {formatTimeFrame(packages?.orders[0]?.startTime, packages?.orders[0]?.endTime)}
              </p>
            </div>
          );
        case 'buildingName':
          return (
            <div className="flex flex-col">
              <ul className="text-small">
                {packages?.orders.map((order) => (
                  <li key={order.buildingId}>{order.buildingName}</li>
                ))}
              </ul>
            </div>
          );
        case 'intendedReceiveDate':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">
                {new Date(packages?.orders[0]?.intendedReceiveDate).toLocaleDateString('en-GB')}
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
                  <DropdownItem onClick={() => openOrderDetail(packages?.deliveryPackageId)}>
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
              {tab === 1 ? 'Các gói hàng hôm nay' : 'Gói hàng hôm nay của tôi'}
            </Button>
          </div>
        ))}
      </div>

      {isActiveTab === 1 ? (
        <TableCustom
          placeHolderSearch="Tìm kiếm gói hàng..."
          description="gói hàng"
          total={allPackages?.value?.totalCount ?? 0}
          columns={ALL_PACKAGES_COLUMNS}
          arrayData={allPackages?.value?.items ?? []}
          searchHandler={(value: string) => {
            const isNumeric = !isNaN(Number(value));
            setQuery({
              ...query,
              deliveryPackageId: isNumeric ? value : '',
              deliveryShopStaffFullName: isNumeric ? '' : value,
            });
          }}
          pagination={allPackages?.value as PageableModel}
          goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
          setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
          selectionMode="single"
          // filters={[statusFilter]}
          isFilter={false}
          renderCell={allPackagesCell}
        />
      ) : (
        <TableCustom
          placeHolderSearch="Tìm kiếm gói hàng..."
          description="gói hàng"
          total={ownerPackages?.value?.totalCount ?? 0}
          columns={OWN_PACKAGES_COLUMNS}
          arrayData={ownerPackages?.value.items ?? []}
          searchHandler={(value: string) => {
            setQuery({ ...query, deliveryPackageId: value });
          }}
          pagination={ownerPackages?.value as PageableModel}
          goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
          setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
          selectionMode="single"
          // filters={[statusFilter]}
          isFilter={false}
          renderCell={ownerPackagesCell}
        />
      )}
    </div>
  );
}
