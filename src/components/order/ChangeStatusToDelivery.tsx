import { formatTimeFrame, toast } from '@/utils/MyUtils';
import apiClient from '@/services/api-services/api-client';
import { Modal, ModalBody, ModalContent, Checkbox, Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import OrderModel from '@/types/models/OrderModel';

type DeliveryOrder = {
  id: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function ChangeStatusToDelivery({ id, isOpen, onClose }: DeliveryOrder) {
  const [data, setData] = useState<OrderModel[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner-staff/delivery-package/${id}`);
        console.log(responseData, 'responseData');
        if (responseData.data.isSuccess) {
          setData(responseData.data?.value.orders);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [id]);

  const handleStatusChange = async () => {
    console.log('Selected Orders:', selectedOrderIds);
    const payload = {
      ids: selectedOrderIds,
    };
    try {
      const responseData = await apiClient.put('shop-owner/order/delivering', payload);
      console.log(responseData, 'responseData');

      if (responseData.data.isSuccess) {
        toast('success', responseData.data.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setSelectedOrderIds([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isDismissable={false} className="rounded-xl">
      <ModalContent>
        {() => (
          <ModalBody className="flex flex-col py-4">
            <p className="text-center pt-2 pb-4 font-bold text-xl">Thông tin gói đơn hàng</p>
            {data.map((order) => (
              <div key={order.id} className="flex items-center">
                <Checkbox
                  isSelected={selectedOrderIds.includes(order.id)}
                  onChange={() => {
                    setSelectedOrderIds((prev) =>
                      prev.includes(order.id)
                        ? prev.filter((id) => id !== order.id)
                        : [...prev, order.id],
                    );
                  }}
                />
                <span className="ml-2">
                  MS-{order.id} | {order.buildingName} (
                  {formatTimeFrame(order.startTime, order.endTime)})
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
              Chuyển sang trạng thái giao hàng
            </Button>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
