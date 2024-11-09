import { Staff } from '@/components/order/AssignOrder';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { toast } from '@/utils/MyUtils';
import { Avatar, Modal, ModalBody, ModalContent } from '@nextui-org/react';
import Swal from 'sweetalert2';

type StaffAssignmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  orderId: number;
};

export const StaffAssignmentModal = ({
  isOpen,
  onClose,
  staffList,
  orderId,
}: StaffAssignmentModalProps) => {
  const { setIsRefetch } = useRefetch();
  const assignOrder = async (staffId: number) => {
    const payload = {
      isConfirm: false,
      shopDeliveryStaffId: staffId === 0 ? undefined : staffId,
    };
    try {
      const responseData = await apiClient.put(`shop-owner/order/${orderId}/assign`, payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', 'Chọn người giao hàng thành công');
      } else if (responseData.data.isWarning) {
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
            const payload = {
              isConfirm: true,
              shopDeliveryStaffId: staffId === 0 ? undefined : staffId,
            };
            const responseData = await apiClient.put(`shop-owner/order/${orderId}/assign`, payload);
            if (responseData.data.isSuccess) {
              setIsRefetch();
              toast('success', 'Chọn người giao hàng thành công');
            } else {
              toast('error', responseData.data.error.message);
            }
          } else {
            return;
          }
        });
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      hideCloseButton
      onClose={onClose}
      className="w-64 left-[520px] top-16"
      backdrop="transparent"
    >
      <ModalContent>
        {() => (
          <ModalBody className="flex">
            {staffList.map((staff) => (
              <div
                key={staff?.staffInfor?.id}
                className="flex flex-row items-center gap-2 hover:cursor-pointer hover:opacity-80 hover:text-slate-700"
                onClick={() => assignOrder(staff?.staffInfor?.id)}
              >
                <Avatar
                  src={staff?.staffInfor?.avatarUrl}
                  alt="Avatar"
                  className="rounded-full w-8 h-8"
                />
                <p>{staff?.staffInfor.isShopOwner ? 'Tôi' : staff?.staffInfor?.fullName}</p>
              </div>
            ))}
            {staffList.length === 0 && (
              <p className="text-danger-500 py-2">Không có nhân viên nào</p>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
