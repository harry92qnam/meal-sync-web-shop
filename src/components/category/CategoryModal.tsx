import apiClient from '@/services/api-services/api-client';
import { toast } from '@/utils/MyUtils';
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

interface CategoryModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên danh mục')
    .max(30, 'Tên danh mục chỉ có tối đa 30 ký tự'),
  description: yup
    .string()
    .required('Vui lòng nhập mô tả')
    .max(100, 'Mô tả chỉ có tối đa 100 ký tự'),
});

export default function CategoryModal({ isOpen, onOpenChange }: CategoryModalProps) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [urlFile, setUrlFile] = useState('');
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const uploadImage = async (image: File | null) => {
    try {
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const responseData = await apiClient.put('storage/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (!responseData.data.isSuccess) {
          setError(responseData.data.error.message);
        } else {
          return responseData.data.value.url;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const url = await uploadImage(avatar);
      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: url,
      };

      const responseData = await apiClient.post('shop-owner/category/create', payload);
      console.log(responseData);
      if (!responseData.data.isSuccess) {
        setError(responseData.data.error.message);
      } else {
        toast('success', 'Tạo mới danh mục thành công');
      }
    } catch (error: any) {
      console.log(error);
    }
    onOpenChange(false);
    formik.resetForm();
    setAvatar(null);
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
    formik.resetForm();
    setAvatar(null);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setAvatar(file);
      setUrlFile(URL.createObjectURL(file));
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col text-2xl text-center">
              Tạo thể loại mới
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <Avatar src={urlFile} alt="Avatar" className="rounded-full w-24 h-24" />
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
                <Input
                  isRequired
                  type="text"
                  name="name"
                  label="Tên danh mục"
                  placeholder="Nhập tên danh mục"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                  errorMessage={formik.touched.name && formik.errors.name}
                />
                <Input
                  type="text"
                  name="description"
                  label="Mô tả"
                  placeholder="Nhập mô tả danh mục"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.description && !!formik.errors.description}
                  errorMessage={formik.touched.description && formik.errors.description}
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
