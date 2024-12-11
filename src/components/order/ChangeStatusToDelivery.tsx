import { formatTimeFrame, toast } from '@/utils/MyUtils';
import apiClient from '@/services/api-services/api-client';
import { Modal, ModalBody, ModalContent, Checkbox, Button, Divider } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import OrderModel from '@/types/models/OrderModel';
import useRefetch from '@/hooks/states/useRefetch';
import PackageModel from '@/types/models/PackageModel';

type DeliveryOrder = {
  id: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function ChangeStatusToDelivery({ id, isOpen, onClose }: DeliveryOrder) {
  const [data, setData] = useState<OrderModel[]>([]);
  const [packageModel, setPackageModel] = useState<PackageModel>();
  const { isRefetch, setIsRefetch } = useRefetch();
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner-staff/delivery-package/${id}`);
        if (responseData.data.isSuccess) {
          setData(responseData.data?.value.orders);
          setPackageModel(responseData.data.value);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [id, isRefetch, onClose]);

  const handleStatusChange = async () => {
    const payload = {
      ids: selectedOrderIds,
    };
    try {
      const responseData = await apiClient.put('shop-owner/order/delivering', payload);
      if (responseData.data.isSuccess) {
        toast('success', responseData.data.value.message);
        setIsRefetch();
        handleClose();
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };

  const handleClose = () => {
    setSelectedOrderIds([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isDismissable={false} className="rounded-xl">
      <ModalContent className="max-h-[640px] overflow-y-scroll">
        {() => (
          <ModalBody className="flex flex-col py-4">
            <p className="text-center pt-2 font-bold text-xl">
              Thông tin gói đơn hàng ({packageModel?.total} đơn hàng)
            </p>
            <Divider />
            <div className="flex flex-col gap-2 mx-4">
              <p className="flex justify-between">
                <span className="text-gray-400">Chưa giao: ({packageModel?.waiting} đơn)</span>
                <span className="text-quaternary">Đang giao: ({packageModel?.delivering} đơn)</span>
              </p>
              <p className="flex justify-between">
                <span className="text-quinary">
                  Giao thành công: ({packageModel?.successful} đơn)
                </span>
                <span className="text-senary">Giao thất bại: ({packageModel?.failed} đơn)</span>
              </p>
              <p className="flex justify-between">
                <span className="text-purple-500">
                  Bị báo cáo: ({packageModel?.issueReported} đơn)
                </span>
              </p>
            </div>
            <Divider />
            {data.map((order) => (
              <div key={order.id} className="flex items-center">
                <Checkbox
                  isSelected={selectedOrderIds.includes(order.id)}
                  onChange={() => {
                    if (order.status === 5) {
                      setSelectedOrderIds((prev) =>
                        prev.includes(order.id)
                          ? prev.filter((id) => id !== order.id)
                          : [...prev, order.id],
                      );
                    }
                  }}
                  isDisabled={order.status !== 5}
                />
                <span className={`${order.status !== 5 ? 'opacity-50' : ''}`}>
                  MS-{order.id} | {order.buildingName} (
                  {formatTimeFrame(order.startTime, order.endTime)}){' '}
                  <span
                    className={`${
                      order.status === 5
                        ? 'text-gray-400'
                        : order.status === 6
                          ? 'text-quaternary'
                          : order.status === 8
                            ? 'text-senary'
                            : order.status === 7 || order.status === 9
                              ? 'text-quinary'
                              : 'text-purple-500'
                    } ml-2`}
                  >
                    {order.status === 5
                      ? 'Chưa giao'
                      : order.status === 6
                        ? 'Đang giao'
                        : order.status === 8
                          ? 'Giao thất bại'
                          : order.status === 7 || order.status === 9
                            ? 'Giao thành công'
                            : 'Bị báo cáo'}
                  </span>
                </span>
              </div>
            ))}
            <Button
              onClick={handleStatusChange}
              disabled={selectedOrderIds.length === 0}
              className={
                selectedOrderIds.length === 0
                  ? 'cursor-not-allowed opacity-50 text-base mt-4'
                  : 'text-base mt-4'
              }
            >
              Tiến hành đi giao
            </Button>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
