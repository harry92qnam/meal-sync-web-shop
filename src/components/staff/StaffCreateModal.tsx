import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
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
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as yup from 'yup';

interface StaffModalProps {
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
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(25, 'Mật khẩu chỉ có tối đa 25 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một ký tự số (0-9)')
    .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in thường (a-z)')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in hoa (A-Z)')
    .matches(
      /[^\w]/,
      'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (`, ~, !, @, #, $, %, ^, &, *, ?)',
    )
    .required('Vui lòng nhập mật khẩu'),
});

export default function StaffCreateModal({ isOpen, onOpenChange }: StaffModalProps) {
  const { setIsRefetch } = useRefetch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleCreate = async (values: any) => {
    console.log(values, 'values');
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        shopDeliveryStaffStatus: 2,
      };

      const responseData = await apiClient.post('shop-owner/delivery-staff/create', payload);
      if (!responseData.data.isSuccess) {
        toast('error', responseData.data.error.message);
      } else {
        setIsRefetch();
        toast('success', `Nhân viên ${values.fullName} đã được tạo thành công`);
        onOpenChange(false);
        formik.resetForm();
      }
    } catch (error: any) {
      toast('error', error?.response?.data?.error?.message);
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
              Tạo mới nhân viên
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
                <Input
                  isRequired
                  type={isVisible ? 'text' : 'password'}
                  name="password"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của nhân viên"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.password && !!formik.errors.password}
                  errorMessage={formik.touched.password && formik.errors.password}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <FaEye className="text-2xl text-default-400" />
                      ) : (
                        <FaEyeSlash className="text-2xl text-default-400" />
                      )}
                    </button>
                  }
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
                Tạo
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
