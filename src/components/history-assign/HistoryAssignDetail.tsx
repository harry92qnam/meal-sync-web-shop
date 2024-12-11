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

export default function HistoryAssignDetail({ id, isOpen, onClose }: DeliveryOrder) {
  const [data, setData] = useState<OrderModel[]>([]);
  const [packageModel, setPackageModel] = useState<PackageModel>();
  const { isRefetch } = useRefetch();

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
  }, [id, isRefetch, isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="rounded-xl">
      <ModalContent>
        {() => (
          <ModalBody className="flex flex-col py-4 max-h-[640px] overflow-y-scroll">
            <p className="text-center pt-2 font-bold text-xl">
              Thông tin gói đơn hàng ({packageModel?.total} đơn hàng)
            </p>
            <Divider />
            <div className="flex flex-col gap-2 mx-2">
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
              <div key={order.id} className="flex items-center mx-2">
                <span>
                  MS-{order.id} | {order.buildingName} (
                  {formatTimeFrame(order.startTime, order.endTime)})
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
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
