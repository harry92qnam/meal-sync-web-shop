'use client';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import StaffCreateModal from '@/components/staff/StaffCreateModal';
import StaffUpdateModal from '@/components/staff/StafffUpdateModal';
import { STAFF_COLUMNS, STAFF_STATUS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { staffApiService } from '@/services/api-services/api-service-instances';
import PageableModel from '@/types/models/PageableModel';
import StaffModel from '@/types/models/StaffModel';
import StaffQuery from '@/types/queries/StaffQuery';
import { formatDate, formatPhoneNumber, toast } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  useDisclosure,
  User,
} from '@nextui-org/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Staffs() {
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [staffDetail, setStaffDetail] = useState<StaffModel | null>(null);
  const { isRefetch, setIsRefetch } = useRefetch();

  const handleCreateNewStaff = async () => {
    onCreateOpen();
  };

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onOpenChange: onUpdateOpenChange,
  } = useDisclosure();

  const [query, setQuery] = useState<StaffQuery>({
    searchValue: '',
    status: 0,
    pageIndex: 1,
    pageSize: 10,
  } as StaffQuery);

  const { data: staffList, refetch } = useFetchWithRQ<StaffModel, StaffQuery>(
    REACT_QUERY_CACHE_KEYS.STAFFS,
    staffApiService,
    query,
  );

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    STAFF_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
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
      setQuery({ ...query, status: value });
    },
  } as TableCustomFilter;

  const handleLock = async (id: number, name: string) => {
    await Swal.fire({
      title: `Bạn có chắc muốn khóa nhân viên ${name} không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          id,
          isConfirm: true,
          status: 3,
        };
        try {
          const responseData = await apiClient.put('shop-owner/delivery-staff/status', payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', `Khóa nhân viên ${name} thành công`);
          } else {
            toast('error', responseData.data.error.message);
          }
        } catch (error: any) {
          toast('error', error.response.data.error.message);
        }
      }
    });
  };

  const handleUnLock = async (id: number, name: string) => {
    await Swal.fire({
      title: `Bạn có chắc muốn mở khóa nhân viên ${name} không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          id,
          isConfirm: true,
          status: 1,
        };
        try {
          const responseData = await apiClient.put('shop-owner/delivery-staff/status', payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', `Mở khóa nhân viên ${name} thành công`);
          } else {
            toast('error', responseData.data.error.message);
          }
        } catch (error: any) {
          toast('error', error.response.data.error.message);
        }
      }
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const responseData = await apiClient.get(`shop-owner/delivery-staff/${id}`);

      if (responseData.data.isSuccess) {
        setStaffDetail(responseData.data.value);
        onUpdateOpen();
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      console.log(error, '>>> error');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa tài khoản nhân viên này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          id,
          isConfirm: true,
        };
        try {
          const responseData = await apiClient.put('shop-owner/delivery-staff/delete', payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', `Xóa tài khoản nhân viên ${name} thành công`);
          } else {
            toast('error', responseData.data.error.message);
          }
        } catch (error: any) {
          toast('error', error.response.data.error.message);
        }
      }
    });
  };

  const renderCell = useCallback((staff: StaffModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-small">{staff.id}</p>
          </div>
        );
      case 'fullName':
        return (
          <User
            avatarProps={{ radius: 'full', src: staff.avatarUrl }}
            name={staff.fullName}
            className="flex justify-start ml-12 gap-4"
          />
        );
      case 'phoneNumber':
        return (
          <div className="flex flex-col">
            <p className="text-small capitalize">{formatPhoneNumber(staff.phoneNumber)}</p>
          </div>
        );
      case 'email':
        return (
          <div className="flex flex-col">
            <p className="text-small">{staff.email}</p>
          </div>
        );
      case 'shopDeliveryStaffStatus':
        return (
          <Chip
            className={`capitalize ${
              staff.shopDeliveryStaffStatus === 1
                ? 'bg-green-200 text-green-600'
                : staff.shopDeliveryStaffStatus === 2
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-red-200 text-red-600'
            }`}
            size="sm"
            variant="flat"
          >
            {staff.shopDeliveryStaffStatus === 1
              ? 'Đang hoạt động'
              : staff.shopDeliveryStaffStatus === 2
                ? 'Nghỉ phép'
                : 'Đã khóa'}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-small">{formatDate(staff.createdDate)}</p>
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
                <DropdownItem onClick={() => handleUpdate(staff.id)}>
                  Cập nhật thông tin
                </DropdownItem>
                {staff.shopDeliveryStaffStatus === 3 ? (
                  <DropdownItem onClick={() => handleUnLock(staff.id, staff.fullName)}>
                    Mở khóa
                  </DropdownItem>
                ) : (
                  <DropdownItem onClick={() => handleLock(staff.id, staff.fullName)}>
                    Khóa tài khoản
                  </DropdownItem>
                )}
                <DropdownItem onClick={() => handleDelete(staff.id, staff.fullName)}>
                  Xóa tài khoản
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
    <MainLayout activeContentIndex={6}>
      <div className="md:col-span-1 pb-20">
        <Header title="Quản lý nhân viên" />
      </div>
      <TableCustom
        placeHolderSearch="Tìm kiếm nhân viên..."
        description="nhân viên"
        columns={STAFF_COLUMNS}
        total={staffList?.value?.totalCount ?? 0}
        arrayData={staffList?.value.items ?? []}
        searchHandler={(value: string) => {
          setQuery({ ...query, searchValue: value });
        }}
        pagination={staffList?.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter]}
        renderCell={renderCell}
        handleAddNew={handleCreateNewStaff}
      />
      <StaffCreateModal
        isOpen={isCreateOpen}
        onOpen={onCreateOpen}
        onOpenChange={onCreateOpenChange}
      />

      <StaffUpdateModal
        staff={staffDetail}
        isOpen={isUpdateOpen}
        onOpen={onUpdateOpen}
        onOpenChange={onUpdateOpenChange}
      />
    </MainLayout>
  );
}
