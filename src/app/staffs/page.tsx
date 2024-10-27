'use client';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import { STAFF_ACTIVE_STATUS, STAFF_COLUMNS, STAFF_STATUS } from '@/data/constants/constants';
import { sampleStaff } from '@/data/TestData';
import PageableModel from '@/types/models/PageableModel';
import StaffModel from '@/types/models/StaffModel';
import StaffQuery from '@/types/queries/StaffQuery';
import { formatDate } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from '@nextui-org/react';
import { ReactNode, useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function Staffs() {
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const [active, setActive] = useState<Selection>(new Set(['0']));

  const handleUpdate = async () => {};

  const handleDelete = async () => {
    await Swal.fire({
      title: 'Bạn có chắc muốn xóa nhân viên này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: 'Đã xóa thành công!',
          icon: 'success',
        });
      }
    });
  };

  const handleAddNewStaff = async () => {
    alert('add new staff');
  };

  const [query, setQuery] = useState<StaffQuery>({
    name: '',
    status: 0,
    pageIndex: 1,
    pageSize: 10,
  } as StaffQuery);

  const staffList = sampleStaff.value.items;
  // const { data: staffList } = useFetchWithRQ<StaffModel, StaffQuery>(
  //   REACT_QUERY_CACHE_KEYS.STAFFS,
  //   staffApiService,
  //   query,
  // );

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

  const activeFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    STAFF_ACTIVE_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
  );

  const activeFilter = {
    label: 'Hoạt động',
    mappingField: 'active',
    selectionMode: 1,
    options: activeFilterOptions,
    selectedValues: active,
    handleFunc: (values: Selection) => {
      const value = Array.from(values).map((val) => parseInt(val.toString()))[0];
      setActive(values);
      setQuery({ ...query, active: value });
    },
  } as TableCustomFilter;

  const renderCell = useCallback((staff: StaffModel, columnKey: React.Key): ReactNode => {
    const cellValue = staff[columnKey as keyof StaffModel];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{staff.id}</p>
          </div>
        );
      case 'name':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{staff.name}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              staff.status === 1 ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'
            }`}
            size="sm"
            variant="flat"
          >
            {STAFF_STATUS.find((item) => item.key === staff.status)?.desc}
          </Chip>
        );
      case 'active':
        return (
          <Chip
            className={`capitalize ${
              staff.active === 1
                ? 'bg-green-200 text-green-600'
                : staff.active === 2
                  ? 'bg-yellow-200 text-yellow-600'
                  : 'bg-gray-200 text-gray-600'
            }`}
            size="sm"
            variant="flat"
          >
            {STAFF_ACTIVE_STATUS.find((item) => item.key === staff.active)?.desc}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(staff.createdDate)}</p>
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
                <DropdownItem onClick={handleUpdate}>Thay đổi</DropdownItem>
                <DropdownItem onClick={handleDelete}>Xóa nhân viên</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
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
        // arrayData={staffs?.value?.items ?? []}
        arrayData={staffList}
        searchHandler={(value: string) => {
          setQuery({ ...query, name: value });
        }}
        pagination={sampleStaff.value as PageableModel}
        goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
        setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
        selectionMode="single"
        filters={[statusFilter, activeFilter]}
        renderCell={renderCell}
        handleAddNew={handleAddNewStaff}
      />
    </MainLayout>
  );
}
