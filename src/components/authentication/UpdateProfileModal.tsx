import { ACCOUNT_INFO } from '@/data/TestData';
import sessionService from '@/services/session-service';
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import * as yup from 'yup';

// Validation schema for updating profile
const validationSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên của bạn').max(30, 'Tên chỉ có tối đa 30 ký tự'),
  phoneNumber: yup
    .string()
    .matches(/((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại'),
});

interface UpdateProfileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function UpdateProfileModal({ isOpen, onOpenChange }: UpdateProfileModalProps) {
  const [isUpdate, setIsUpdate] = useState(false);
  const authDTO = sessionService.getAuthDTO();
  const formik = useFormik({
    initialValues: {
      name: authDTO?.fullName,
      email: authDTO?.email,
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle logic here for updating profile
      onOpenChange(false); // Close modal after submission
    },
  });

  const [avatar, setAvatar] = useState<string | undefined>(authDTO?.avatarUrl);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      // handle update avatar here
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col text-2xl text-center">Cập nhật hồ sơ</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <Avatar
                  src={avatar || './images/'}
                  alt="Avatar"
                  className="rounded-full w-36 h-36"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  id="file-input"
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer text-gray-500 underline my-2">
                  Chọn hình ảnh
                </label>
              </div>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Name input */}
                <Input
                  type="text"
                  name="name"
                  label="Tên"
                  placeholder="Nhập tên của bạn"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                  errorMessage={formik.touched.name && formik.errors.name}
                  readOnly={!isUpdate}
                  className={!isUpdate ? 'opacity-50' : ''}
                />
                {/* Phone number input */}
                {/* <Input
                  type="text"
                  name="phoneNumber"
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại của bạn"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                  errorMessage={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  readOnly={!isUpdate}
                  className={!isUpdate ? 'opacity-50' : ''}
                /> */}
                {/* Email input (read-only) */}
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Email của bạn"
                  value={formik.values.email}
                  readOnly
                  className="opacity-50"
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="faded"
                onClick={onClose}
                className="hover:text-danger-500 hover:border-danger-500"
              >
                Đóng
              </Button>
              <Button
                type="button"
                color="primary"
                onClick={() => {
                  if (isUpdate) {
                    formik.handleSubmit();
                  }
                  setIsUpdate(!isUpdate);
                }}
              >
                {isUpdate ? 'Cập nhật' : 'Chỉnh sửa'}
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
