'use client';
import Header from '@/components/common/Header';
import { PlusIcon } from '@/components/common/PlusIcon';
import MainLayout from '@/components/layout/MainLayout';
import apiClient from '@/services/api-services/api-client';
import ActiveSlotModel from '@/types/models/ActiveSlotModel';
import { toast } from '@/utils/MyUtils';
import { Button, Chip, Switch } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function Shop() {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState(1);
  const [isOvernight, setIsOvernight] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const [activeSlots, setActiveSlots] = useState<ActiveSlotModel[]>([]);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const fetchData = async () => {
    try {
      const responseData = await apiClient.get('shop-owner/full-infor');
      setStatus(responseData.data.value.status);
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();

  const changeShopStatus = async () => {
    try {
      const payload = {
        status: status === 2 ? 3 : 2,
        isConfirm: false,
      };

      const responseData = await apiClient.put('shop-owner/shop-owner/active-inactive', payload);
      if (!responseData.data.isSuccess) {
        console.log(responseData.data.error.message);
      } else {
        toast('success', 'Cập nhật trạng thái cửa hàng thành công');
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addNewSlot = async () => {
    try {
      const payload = {
        title,
        startTime,
        endTime,
      };
      const responseData = await apiClient.post('shop-owner/operating-slot', payload);
      if (!responseData.data.isSuccess) {
        console.log(responseData.data.error.message);
      } else {
        toast('success', 'Tạo khung giờ mới thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSlot = async (id: number) => {
    try {
      const payload = {
        id,
        title,
        startTime,
        endTime,
      };
      const responseData = await apiClient.put(`shop-owner/operating-slot/${id}`, payload);
      if (!responseData.data.isSuccess) {
        console.log(responseData.data.error.message);
      } else {
        toast('success', 'Cập nhật khung giờ thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSlot = async (id: number) => {
    try {
      const payload = {
        id,
        IsConfirm: false,
      };
      const responseData = await apiClient.delete(`shop-owner/operating-slot/${id}`, {
        data: payload,
      });
      if (!responseData.data.isSuccess) {
        console.log(responseData.data.error.message);
      } else {
        toast('success', 'Xóa khung giờ thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchActiveSlots = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/operating-slot');
        if (!responseData.data.isSuccess) {
          console.log(responseData.data.error.message);
        } else {
          setActiveSlots(responseData.data.value);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchActiveSlots();
  }, []);

  return (
    <MainLayout activeContentIndex={8}>
      <div className="text-xl">
        <Header title="Cài đặt cửa hàng" />
        <div className="pt-24 px-4">
          <div className="flex items-center justify-between pb-12">
            <Chip
              className={`text-medium px-2 py-4 ${status === 2 ? 'text-quinary bg-green-200' : 'text-senary bg-red-200'}`}
              size="sm"
              variant="flat"
            >
              {status === 2 ? 'Đang hoạt động' : 'Tạm đóng cửa'}
            </Chip>
            <Switch isSelected={status === 2} aria-label="Shop status" onClick={changeShopStatus} />
          </div>

          <div>
            <div className="flex items-center justify-between pb-2">
              <p>Khung giờ mở bán:</p>
              <Button
                type="button"
                color="primary"
                className=" text-secondary text-medium"
                endContent={<PlusIcon />}
                size="sm"
                onClick={addNewSlot}
              >
                Thêm
              </Button>
            </div>
            <ul>
              {activeSlots.map((slot, index) => (
                <li key={index} className="text-medium flex gap-8 pb-2 items-center">
                  {slot.frameFormat}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      color="default"
                      size="sm"
                      onClick={() => updateSlot(slot.id)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      type="button"
                      color="warning"
                      size="sm"
                      className="text-white bg-senary"
                      onClick={() => deleteSlot(slot.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex justify-between items-center my-6">
            Cho phép đặt hàng qua đêm
            <Switch defaultSelected aria-label="Overnight order" size="sm" />
          </p>

          <div>
            <p className="flex justify-between items-center">
              Tự động xác nhận đơn hàng
              <Switch defaultSelected aria-label="Overnight order" size="sm" />
            </p>
            <i className="text-base">
              ⚠️Lưu ý: Tính năng này chỉ hoạt động trong thời gian hoạt động của cửa hàng
            </i>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
