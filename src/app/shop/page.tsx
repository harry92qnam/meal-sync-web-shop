'use client';
import Header from '@/components/common/Header';
import { PlusIcon } from '@/components/common/PlusIcon';
import MainLayout from '@/components/layout/MainLayout';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import ShopModel from '@/types/models/ShopModel';
import {
  convertNumberToTime,
  convertTimeToNumber,
  formatPhoneNumber,
  isLocalImage,
  toast,
} from '@/utils/MyUtils';
import {
  Avatar,
  Button,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  useDisclosure,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import * as yup from 'yup';

type OperatingSlotModel = {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  isReceivingOrderPaused: boolean;
  frameFormat: string;
};

const validationSchema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề').max(30, 'Tiêu đề chỉ có tối đa 30 ký tự'),
});

export default function Shop() {
  const [shopInfor, setShopInfor] = useState<ShopModel>();
  const { isRefetch, setIsRefetch } = useRefetch();
  const [operatingSlot, setOperatingSlot] = useState<OperatingSlotModel>();
  const [slotId, setSlotId] = useState<number>();

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onOpenChange: onUpdateOpenChange,
    onClose: onUpdateClose,
  } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema,
    onSubmit: (values) => {
      addNewSlot(values);
    },
  });

  const formikUpdate = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema,
    onSubmit: (values) => {
      updateSlot(values);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/full-infor');
        setShopInfor(responseData.data.value);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isRefetch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/full-infor');
        const slots = responseData.data.value?.operatingSlots as unknown as OperatingSlotModel[];
        const foundSlot = slots?.find((slot) => slot.id === slotId);
        if (foundSlot) {
          setOperatingSlot(foundSlot);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [slotId, isRefetch]);

  const changeShopStatus = async () => {
    try {
      const payload = {
        status: shopInfor?.status === 2 ? 3 : 2,
        isConfirm: false,
      };

      const responseData = await apiClient.put('shop-owner/shop-owner/active-inactive', payload);

      if (responseData.data.isWarning) {
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
            const responseData = await apiClient.put('shop-owner/shop-owner/active-inactive', {
              ...payload,
              isConfirm: true,
            });
            if (responseData.data.isSuccess) {
              toast('success', 'Cập nhật trạng thái cửa hàng thành công');
              setIsRefetch();
            } else {
              toast('error', responseData.data.error.message);
            }
          } else {
            return;
          }
        });
      } else if (responseData.data.isSuccess) {
        toast('success', 'Cập nhật trạng thái cửa hàng thành công');
        setIsRefetch();
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeOvernight = async () => {
    try {
      const payload = {
        isAcceptingOrderNextDay: !shopInfor?.isAcceptingOrderNextDay,
      };

      const responseData = await apiClient.put('shop-owner/is-accept-order-next-day', payload);
      if (!responseData.data.isSuccess) {
        console.log(responseData.data.error.message);
      } else {
        setIsRefetch();
        toast(
          'success',
          `${shopInfor?.isAcceptingOrderNextDay ? 'Tắt' : 'Bật'} cho phép đặt hàng cho ngày mai thành công`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeAutoConfirm = async () => {
    try {
      const payload = {
        isAutoOrderConfirmation: !shopInfor?.isAutoOrderConfirmation,
        isConfirm: false,
      };

      const responseData = await apiClient.put('shop-owner/is-auto-confirm', payload);
      if (!responseData.data.isSuccess) {
        console.log(responseData.data.error.message);
      } else {
        toast(
          'success',
          `${shopInfor?.isAutoOrderConfirmation ? 'Tắt' : 'Bật'} tính năng tự động nhận đơn thành công`,
        );
        setIsRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addNewSlot = async (values: { title: string }) => {
    if (startTime > endTime) {
      toast('error', "Thời gian bắt đầu phải sớm hơn thời gian kết thúc ít nhất 30'");
    } else {
      try {
        const payload = {
          title: values.title,
          startTime,
          endTime,
          isActive: true,
          isReceivingOrderPaused: false,
        };
        const responseData = await apiClient.post('shop-owner/operating-slot', payload);
        if (responseData.data.isSuccess) {
          setIsRefetch();
          toast('success', 'Tạo khung giờ mới thành công');
          handleCancel(onCreateClose);
        } else {
          toast('error', 'Định dạng thời gian khung đúng');
        }
      } catch (error: any) {
        toast('error', error.response.data.error.message);
      }
    }
  };

  const updateSlot = async (values: { title: string | undefined }) => {
    setStartTime((prevStartTime) => prevStartTime || operatingSlot?.startTime || 0);
    setEndTime((prevEndTime) => prevEndTime || operatingSlot?.endTime || 0);

    if (startTime > endTime) {
      toast('error', "Thời gian bắt đầu phải sớm hơn thời gian kết thúc ít nhất 30'");
    } else {
      try {
        const payload = {
          slotId,
          title: values.title,
          startTime,
          endTime,
          isConfirm: false,
          isActive: true,
          isReceivingOrderPaused: false,
        };
        const responseData = await apiClient.put(`shop-owner/operating-slot/${slotId}`, {
          ...payload,
          isConfirm: true,
        });

        if (responseData.data.isWarning) {
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
              const responseData = await apiClient.put(
                `shop-owner/operating-slot/${slotId}`,
                payload,
              );
              if (responseData.data.isSuccess) {
                setIsRefetch();
                toast('success', 'Cập nhật khung giờ thành công');
                handleCancel(onUpdateClose);
              } else {
                toast('error', responseData.data.error.message);
              }
            } else {
              return;
            }
          });
        } else if (responseData.data.isSuccess) {
          setIsRefetch();
          toast('success', 'Cập nhật khung giờ thành công');
          handleCancel(onUpdateClose);
        } else {
          toast('error', responseData.data.value.message);
        }
      } catch (error: any) {
        toast('error', error.response.data.error.message);
      }
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
      if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
      if (responseData.data.isWarning) {
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
            const responseData = await apiClient.delete(`shop-owner/operating-slot/${id}`, {
              data: {
                ...payload,
                IsConfirm: true,
              },
            });
            if (responseData.data.isSuccess) {
              setIsRefetch();
              toast('success', responseData.data.value.message);
            } else {
              toast('error', responseData.data.error.message);
            }
          } else {
            return;
          }
        });
      } else if (responseData.data.isSuccess) {
        setIsRefetch();
        toast('success', responseData.data.value.message);
      } else {
        toast('error', responseData.data.error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
    formik.resetForm();
    formikUpdate.resetForm();
    setStartTime(0);
    setEndTime(0);
  };

  return (
    <MainLayout activeContentIndex={-1}>
      <div className="text-xl">
        <Header title="Cài đặt cửa hàng" />
        <div className="grid grid-cols-3 pt-20">
          <div className="relative">
            {!isLocalImage(shopInfor?.bannerUrl || '') && (
              <Image
                src={shopInfor?.bannerUrl ?? '/images/banner.jpg'}
                width={0}
                height={0}
                sizes="100vw"
                className="opacity-50 w-[380px] h-[210px] rounded-md"
                alt="banner shop"
                loading="lazy"
              />
            )}
            <Avatar
              src={shopInfor?.logoUrl ?? '/images/avatar.png'}
              className="absolute -translate-y-24 translate-x-56 w-32 h-32 border-small"
            />
          </div>
          <div className="flex flex-col gap-1 ml-4">
            <p className="text-lg text-gray-600">
              Chủ cửa hàng: <strong>{shopInfor?.shopOwnerName}</strong>
            </p>
            <p className="text-lg text-gray-600">
              Số điện thoại: <strong>{formatPhoneNumber(shopInfor?.phoneNumber ?? '')}</strong>
            </p>
            <p className="text-lg text-gray-600">
              Email: <strong>{shopInfor?.email}</strong>
            </p>
            <div className="text-lg text-gray-600">
              Khu vực mở bán:
              <ul className="list-disc pl-5">
                {shopInfor?.shopDormitories.map((dor) => (
                  <li key={dor.dormitoryId} className="text-gray-800">
                    {dor.name}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-lg text-gray-600">
              Địa chỉ: <strong>{shopInfor?.location.address}</strong>
            </p>
          </div>
          <div className="flex flex-col justify-start">
            <p className="flex justify-between items-center">
              Trạng thái cửa hàng:
              <Switch
                isSelected={shopInfor?.status === 2}
                aria-label="Shop status"
                onClick={changeShopStatus}
                size="sm"
              />
            </p>
            <p className="flex justify-between items-center my-4">
              Cho phép đặt hàng cho ngày mai:
              <Switch
                isSelected={shopInfor?.isAcceptingOrderNextDay}
                aria-label="Overnight order"
                size="sm"
                onClick={changeOvernight}
              />
            </p>

            <div>
              <p className="flex justify-between items-center">
                Tự động xác nhận đơn hàng:
                <Switch
                  isSelected={shopInfor?.isAutoOrderConfirmation}
                  aria-label="Overnight order"
                  size="sm"
                  onClick={changeAutoConfirm}
                />
              </p>
              <i className="text-sm text-red-500">
                ⚠️Lưu ý: Tính năng này chỉ hoạt động trong thời gian hoạt động của cửa hàng
              </i>
            </div>
          </div>
        </div>
        <div className="pt-8 px-4">
          <Divider className="my-4" />
          <div>
            <div className="flex items-center justify-between pb-2">
              <p>Khung giờ mở bán:</p>
              <Button
                type="button"
                color="primary"
                className=" text-secondary text-medium"
                endContent={<PlusIcon />}
                size="sm"
                onClick={onCreateOpen}
              >
                Thêm
              </Button>
            </div>
            <ul>
              {shopInfor?.operatingSlots.map((slot, index) => (
                <li
                  key={index}
                  className="text-medium flex w-2/5 justify-between pb-2 items-center"
                >
                  <span>
                    {slot.title}: {slot.timeSlot}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      color="default"
                      size="sm"
                      onClick={() => {
                        onUpdateOpen();
                        setSlotId(slot.id);
                      }}
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
            {/* create new operating slot */}
            <Modal
              closeButton
              isOpen={isCreateOpen}
              hideCloseButton
              onOpenChange={onCreateOpenChange}
              isDismissable={false}
            >
              <ModalContent>
                {(onClose) => (
                  <React.Fragment>
                    <ModalHeader className="flex flex-col text-center">
                      Tạo khung giờ mở bán
                    </ModalHeader>
                    <ModalBody>
                      <form>
                        <div className="flex flex-col items-center gap-2">
                          <Input
                            isRequired
                            type="text"
                            name="title"
                            label="Tiêu đề khung giờ"
                            placeholder="Nhập tiêu đề khung giờ"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.title && !!formik.errors.title}
                            errorMessage={formik.touched.title && formik.errors.title}
                          />
                          <div className="flex gap-2 w-full">
                            <Input
                              isRequired
                              type="time"
                              label="Giờ bắt đầu"
                              value={convertNumberToTime(startTime)}
                              onChange={(e) => setStartTime(convertTimeToNumber(e.target.value))}
                            />
                            <Input
                              isRequired
                              type="time"
                              label="Giờ kết thúc"
                              value={convertNumberToTime(endTime)}
                              onChange={(e) => setEndTime(convertTimeToNumber(e.target.value))}
                            />
                          </div>
                        </div>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="faded"
                        className="hover:text-danger-500 hover:border-danger-500"
                        onClick={() => handleCancel(onClose)}
                      >
                        Đóng
                      </Button>
                      <Button type="button" color="primary" onClick={() => formik.handleSubmit()}>
                        Tạo
                      </Button>
                    </ModalFooter>
                  </React.Fragment>
                )}
              </ModalContent>
            </Modal>
            {/* update operating slots */}
            <Modal
              closeButton
              isOpen={isUpdateOpen}
              hideCloseButton
              onOpenChange={onUpdateOpenChange}
              isDismissable={false}
            >
              <ModalContent>
                {(onClose) => (
                  <React.Fragment>
                    <ModalHeader className="flex flex-col text-center">
                      Cập nhật khung giờ mở bán
                    </ModalHeader>
                    <ModalBody>
                      <form>
                        <div className="flex flex-col items-center gap-2">
                          <Input
                            isRequired
                            type="text"
                            name="title"
                            label="Tiêu đề khung giờ"
                            placeholder="Nhập tiêu đề khung giờ"
                            value={formikUpdate.values.title || operatingSlot?.title}
                            onChange={formikUpdate.handleChange}
                            onBlur={formikUpdate.handleBlur}
                            isInvalid={
                              !operatingSlot?.title &&
                              formikUpdate.touched.title &&
                              !!formikUpdate.errors.title
                            }
                            errorMessage={
                              !operatingSlot?.title &&
                              formikUpdate.touched.title &&
                              formikUpdate.errors.title
                            }
                          />
                          <div className="flex gap-2 w-full">
                            <Input
                              isRequired
                              type="time"
                              label="Giờ bắt đầu"
                              value={convertNumberToTime(
                                startTime || operatingSlot?.startTime || 0,
                              )}
                              onChange={(e) =>
                                setStartTime(convertTimeToNumber(e.target.value || '00:00'))
                              }
                            />
                            <Input
                              isRequired
                              type="time"
                              label="Giờ kết thúc"
                              value={convertNumberToTime(endTime || operatingSlot?.endTime || 0)}
                              onChange={(e) =>
                                setEndTime(convertTimeToNumber(e.target.value || '00:00'))
                              }
                            />
                          </div>
                        </div>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="faded"
                        className="hover:text-danger-500 hover:border-danger-500"
                        onClick={() => handleCancel(onClose)}
                      >
                        Đóng
                      </Button>
                      <Button
                        type="button"
                        color="primary"
                        onClick={() =>
                          updateSlot({
                            title: formikUpdate.values.title || operatingSlot?.title || '',
                          })
                        }
                      >
                        Cập nhật
                      </Button>
                    </ModalFooter>
                  </React.Fragment>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
