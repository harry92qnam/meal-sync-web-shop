import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import StaffModel from '@/types/models/StaffModel';
import { toast } from '@/utils/MyUtils';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

interface StaffModalProps {
  staff: StaffModel | null;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Vui lòng nhập tên nhân viên')
    .max(30, 'Tên nhân viên chỉ có tối đa 30 ký tự'),
  email: yup
    .string()
    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, 'Email không hợp lệ!')
    .required('Vui lòng nhập email'),
  phoneNumber: yup
    .string()
    .matches(/((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại'),
});

export default function StaffUpdateModal({ staff, isOpen, onOpenChange }: StaffModalProps) {
  const { setIsRefetch } = useRefetch();
  console.log(staff, 'staff');

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: staff?.fullName,
      phoneNumber: staff?.phoneNumber,
      email: staff?.email,
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  const handleUpdate = async (values: any) => {
    try {
      const payload = {
        id: staff?.id,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        imgUrl: staff?.avatarUrl,
        gender: staff?.genders,
        status: staff?.shopDeliveryStaffStatus,
      };

      const responseData = await apiClient.put('shop-owner/delivery-staff/info', payload);
      console.log(responseData);
      if (!responseData.data.isSuccess) {
        toast('error', responseData.data.error.message);
      } else {
        setIsRefetch();
        toast('success', 'Cập nhật món ăn thành công');
        onOpenChange(false);
        formik.resetForm();
      }
    } catch (error: any) {
      toast('error', 'Thiếu thông tin sản phẩm!');
    }
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
    formik.resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      isDismissable={false}
      className="max-h-[640px]"
    >
      <ModalContent className="pt-4">
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col text-2xl text-center">
              Cập nhật thông tin nhân viên
            </ModalHeader>
            <ModalBody className="overflow-y-auto">
              <form className="space-y-4">
                <Input
                  isRequired
                  type="text"
                  name="fullName"
                  label="Tên nhân viên"
                  placeholder="Nhập tên nhân viên"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.fullName && !!formik.errors.fullName}
                  errorMessage={formik.touched.fullName && formik.errors.fullName}
                />
                <Input
                  isRequired
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Nhập email của nhân viên"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                  errorMessage={formik.touched.email && formik.errors.email}
                />
                <Input
                  isRequired
                  type="text"
                  name="phoneNumber"
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại của nhân viên"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                  errorMessage={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="faded"
                onClick={() => handleCancel(onClose)}
                className="hover:text-danger-500 hover:border-danger-500"
              >
                Đóng
              </Button>
              <Button type="button" color="primary" onClick={() => formik.handleSubmit()}>
                Cập nhật
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
