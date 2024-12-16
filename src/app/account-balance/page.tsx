'use client';
import Header from '@/components/common/Header';
import TableCustom, { TableCustomFilter } from '@/components/common/TableCustom';
import MainLayout from '@/components/layout/MainLayout';
import DepositCreateModal from '@/components/withdrawal-request/DepositCreateModal';
import WithDrawalRequestCreateModal from '@/components/withdrawal-request/WithDrawalRequestCreateModal';
import { WITHDRAWAL_COLUMNS, WITHDRAWAL_STATUS } from '@/data/constants/constants';
import REACT_QUERY_CACHE_KEYS from '@/data/constants/react-query-cache-keys';
import useFetchWithRQ from '@/hooks/fetching/useFetchWithRQ';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { withdrawalApiService } from '@/services/api-services/api-service-instances';
import PageableModel from '@/types/models/PageableModel';
import WithdrawalModel from '@/types/models/WithdrawalModel';
import WithdrawalQuery from '@/types/queries/WithdrawalQuery';
import { formatCurrency, formatTimeToSeconds, toast } from '@/utils/MyUtils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

interface Overview {
  availableAmount: number;
  incomingAmount: number;
  reportingAmount: number;
  isAllowedRequestWithdrawal: boolean;
}

interface HistoryTransaction {
  id: number;
  walletFromId: number;
  nameOfWalletOwnerFrom: string;
  walletToId: number;
  nameOfWalletOwnerTo: string;
  paymentId?: number;
  avaiableAmountBefore: number;
  incomingAmountBefore: number;
  reportingAmountBefore: number;
  amount: number;
  totalAmountAfter: number;
  type: number;
  description: string;
  createdDate: string;
}

export default function AccountBalance() {
  const router = useRouter();
  const { range } = usePeriodTimeFilterState();
  const [isActiveTab, setIsActiveTab] = useState(1);
  const [statuses, setStatuses] = useState<Selection>(new Set(['0']));
  const { isRefetch, setIsRefetch } = useRefetch();
  const [overview, setOverview] = useState<Overview>();
  const [historyList, setHistoryList] = useState<HistoryTransaction[]>([]);
  const [tmp, setTmp] = useState<PageableModel>();
  const [pageSize, setPageSize] = useState(10);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isCreateDepositOpen,
    onOpen: onCreateDepositOpen,
    onClose: onCreateDepositClose,
    onOpenChange: onCreateDepositOpenChange,
  } = useDisclosure();

  const [query, setQuery] = useState<WithdrawalQuery>({
    searchValue: '',
    status: 0,
    startDate: range.dateFrom,
    endDate: range.dateTo,
    pageIndex: 1,
    pageSize: 10,
  } as WithdrawalQuery);

  const { data: withdrawals, refetch } = useFetchWithRQ<WithdrawalModel, WithdrawalQuery>(
    REACT_QUERY_CACHE_KEYS.WITHDRAWALS,
    withdrawalApiService,
    query,
  );

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  useEffect(() => {
    const fetchHistoryList = async () => {
      const responseData = await apiClient.get(`shop-owner/walet-transaction?pageSize=${pageSize}`);
      if (responseData.data.isSuccess) {
        setHistoryList((prev) => {
          const newItems = responseData.data.value.items;
          const existingIds = new Set(prev.map((item: { id: any }) => item.id));
          const uniqueNewItems = newItems.filter((item: { id: any }) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
        setTmp(responseData.data.value);
      }
    };
    if (isActiveTab === 2) {
      fetchHistoryList();
    }
  }, [isActiveTab, pageSize]);

  useEffect(() => {
    setPageSize(10);
  }, [isActiveTab]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/wallet/summary');
        if (responseData.data.isSuccess) {
          setOverview(responseData.data?.value);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };
    if (isActiveTab === 1) {
      fetchBanks();
    }
  }, [isActiveTab]);

  const statusFilterOptions = [{ key: 0, desc: 'Tất cả' }].concat(
    WITHDRAWAL_STATUS.map((item) => ({ key: item.key, desc: item.desc })),
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

  const handleCancelRequest = async (id: number) => {
    await Swal.fire({
      title: `Bạn có chắc chắn muốn hủy yêu cầu rút tiền MS-${id} không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            id,
            isConfirm: true,
          };
          const responseData = await apiClient.put('shop-owner/withdrawal/cancel', payload);
          if (responseData.data.isSuccess) {
            setIsRefetch();
            toast('success', responseData.data.value.message);
          }
        } catch (error: any) {
          toast('error', error.response.data.error.message);
        }
      }
    });
  };
  const handleOpenDetail = async (id: number) => {
    router.push(`account-balance/${id}`);
  };

  const handleAddNewRequest = async () => {
    // if (overview?.isAllowedRequestWithdrawal) {
    onCreateOpen();
    // } else {
    //   toast(
    //     'error',
    //     'Hiện đang có yêu cầu chưa được duyệt. Vui lòng hủy yêu cầu hoặc thử lại sau!',
    //   );
    // }
  };

  const handleLoadMore = () => {
    if (tmp!.totalCount > pageSize) {
      setPageSize(pageSize + 10);
    }
  };

  const handleDeposit = () => {
    onCreateDepositOpen();
  };

  const renderCell = useCallback((withdrawal: WithdrawalModel, columnKey: React.Key): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">MS-{withdrawal.id}</p>
          </div>
        );
      case 'bankShortName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{withdrawal.bankShortName}</p>
          </div>
        );
      case 'bankAccountNumber':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{withdrawal.bankAccountNumber}</p>
          </div>
        );
      case 'amount':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{formatCurrency(withdrawal.amount)}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className={`capitalize ${
              withdrawal.status === 1
                ? 'bg-gray-200 text-gray-600'
                : withdrawal.status === 2
                  ? 'bg-red-200 text-rose-600'
                  : withdrawal.status === 3
                    ? 'bg-yellow-200 text-yellow-600'
                    : withdrawal.status === 4
                      ? 'bg-green-200 text-green-600'
                      : 'bg-red-200 text-rose-600'
            }`}
            size="sm"
            variant="flat"
          >
            {WITHDRAWAL_STATUS.find((item) => item.key == withdrawal.status)?.desc}
          </Chip>
        );
      case 'createdDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatTimeToSeconds(withdrawal.createdDate)}</p>
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
                {withdrawal.status === 1 ? (
                  <DropdownItem onClick={() => handleCancelRequest(withdrawal.id)}>
                    Hủy yêu cầu
                  </DropdownItem>
                ) : (
                  <DropdownItem className="hidden"></DropdownItem>
                )}
                <DropdownItem onClick={() => handleOpenDetail(withdrawal.id)}>
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
    <MainLayout activeContentIndex={7}>
      <div className="md:col-span-1 pb-32">
        <Header title="Quản lý tài chính" />
      </div>

      <div className="flex fixed top-[72px] z-30 bg-white shadow-md py-2 left-[305px] w-[1209px] justify-around border-t-small">
        {[1, 2].map((tab) => (
          <div key={tab} className={isActiveTab === tab ? 'border-b-2 border-b-primary' : ''}>
            <Button
              onClick={() => {
                if (isActiveTab !== tab) {
                  setIsActiveTab(tab);
                }
              }}
              className={`${isActiveTab === tab ? 'text-primary' : 'text-black'} bg-transparent text-lg font-medium`}
            >
              {tab === 1 ? 'Yêu cầu đã tạo' : 'Biến động số dư'}
            </Button>
          </div>
        ))}
      </div>

      {isActiveTab === 1 ? (
        <>
          <div className="shadow-md rounded-lg p-4 mb-4">
            <div className="flex gap-12 items-center">
              <p>
                Số dư có sẵn:{' '}
                <strong className="text-quinary text-xl">
                  {formatCurrency(overview?.availableAmount ?? 0)}
                </strong>
              </p>
              <Button
                type="button"
                color="success"
                className=" text-secondary px-4 text-medium"
                size="sm"
                onClick={handleDeposit}
              >
                Nạp tiền
              </Button>
            </div>
            <p>
              Tiền bán chờ về:{' '}
              <strong className="text-xl">{formatCurrency(overview?.incomingAmount ?? 0)}</strong>
            </p>
            <p>
              Tiền của đơn đang có báo cáo:{' '}
              <strong className="text-senary text-xl">
                {formatCurrency(overview?.reportingAmount ?? 0)}
              </strong>
            </p>
          </div>
          <TableCustom
            placeHolderSearch="Tìm kiếm yêu cầu..."
            description="yêu cầu"
            columns={WITHDRAWAL_COLUMNS}
            arrayData={withdrawals?.value?.items ?? []}
            total={withdrawals?.value.totalCount ?? 0}
            searchHandler={(value: string) => {
              const updatedValue = value.toLocaleLowerCase().startsWith('ms-')
                ? value.slice(3)
                : value;
              setQuery({ ...query, searchValue: updatedValue });
            }}
            pagination={withdrawals?.value as PageableModel}
            goToPage={(index: number) => setQuery({ ...query, pageIndex: index })}
            setPageSize={(size: number) => setQuery({ ...query, pageSize: size })}
            selectionMode="single"
            filters={[statusFilter]}
            renderCell={renderCell}
            handleRowClick={handleOpenDetail}
            handleAddNew={handleAddNewRequest}
          />
          <WithDrawalRequestCreateModal
            isOpen={isCreateOpen}
            onOpen={onCreateOpen}
            onOpenChange={onCreateOpenChange}
            isAllowedRequestWithdrawal={overview?.isAllowedRequestWithdrawal ?? false}
          />
          <DepositCreateModal
            isOpen={isCreateDepositOpen}
            onOpen={onCreateDepositOpen}
            onClose={onCreateDepositClose}
            onOpenChange={onCreateDepositOpenChange}
          />
        </>
      ) : (
        <>
          {historyList.map((request) => (
            <div className="shadow-md border-small px-4 py-2 my-4 rounded-lg" key={request.id}>
              <p className="text-sm text-slate-500 pb-2">
                {formatTimeToSeconds(request.createdDate)}
              </p>

              {request.type === 1 ? (
                <p>
                  Số dư tài khoản bạn đã bị{' '}
                  <strong className="text-senary">{formatCurrency(request.amount)}</strong> vào lúc{' '}
                  <strong>{formatTimeToSeconds(request.createdDate)}</strong>. Số dư hiện tại:{' '}
                  <strong>{formatCurrency(request.totalAmountAfter)}</strong>
                </p>
              ) : (
                <p>
                  Số dư tài khoản bạn đã được
                  <strong className="text-quinary"> +{formatCurrency(request.amount)}</strong> vào
                  lúc <strong>{formatTimeToSeconds(request.createdDate)}</strong>. Số dư hiện tại:{' '}
                  <strong>{formatCurrency(request.totalAmountAfter)}</strong>
                </p>
              )}
              <p>
                Nội dung: <span>{request.description}</span>
              </p>
            </div>
          ))}
          {tmp && tmp.totalCount > pageSize && (
            <div className="flex justify-center">
              <Button onClick={() => handleLoadMore()}>Xem thêm</Button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
