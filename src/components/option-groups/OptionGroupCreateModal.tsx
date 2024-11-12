import { PlusIcon } from '@/components/common/PlusIcon';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import OptionGroupModel from '@/types/models/OptionGroupModel';
import { formatPriceForInput, toast } from '@/utils/MyUtils';
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';

interface OptionGroupModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Vui lòng nhập tên nhóm lựa chọn')
    .max(30, 'Tên nhóm lựa chọn chỉ có tối đa 30 ký tự'),
  // type: yup.number().positive('Vui lòng nhập giá bán'),
  // description: yup.string().max(100, 'Mô tả chỉ có tối đa 100 ký tự'),
});

export default function OptionGroupCreateModal({ isOpen, onOpenChange }: OptionGroupModalProps) {
  const { setIsRefetch } = useRefetch();
  const [options, setOptions] = useState([
    {
      isDefault: false,
      title: '',
      isCalculatePrice: false,
      price: 0,
      imageUrl: '',
    },
  ]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        isDefault: false,
        title: '',
        isCalculatePrice: false,
        price: 0,
        imageUrl: '',
      },
    ]);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      type: '1',
      isRequire: '1',
      options: [
        {
          isDefault: false,
          title: '',
          isCalculatePrice: false,
          price: 0,
          imageUrl: '',
        },
      ],
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
          toast('error', responseData.data.error.message);
        } else {
          return responseData.data.value.url;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreate = async (values: any) => {
    console.log(values, 'values');
    // try {
    //   const url = await uploadImage(avatar);
    //   const payload = {
    //     name: values.name,
    //     description: values?.description,
    //     price: Number(values?.price),
    //     imgUrl: url,
    //     operatingSlots: Array.from(values.operatingSlots).map(Number),
    //     shopCategoryId: Number(values.shopCategoryId.currentKey),
    //     platformCategoryId: Number(values.platformCategoryId.currentKey),
    //     optionGroups: Array.from(values.optionGroups).map(Number),
    //     status: 1,
    //   };
    //   console.dir(payload);
    //   const responseData = await apiClient.post('shop-owner/food/create', payload);
    //   console.log(responseData);
    //   if (!responseData.data.isSuccess) {
    //     toast('error', responseData.data.error.message);
    //   } else {
    //     setIsRefetch();
    //     toast('success', 'Tạo món ăn thành công');
    //     onOpenChange(false);
    //     formik.resetForm();
    //     setAvatar(null);
    //     setUrlFile('');
    //   }
    // } catch (error: any) {
    //   toast('error', 'Thiếu thông tin sản phẩm!');
    // }
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
    formik.resetForm();
    // setAvatar(null);
    // setUrlFile('');
  };

  // const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files![0];
  //   if (file) {
  //     setAvatar(file);
  //     setUrlFile(URL.createObjectURL(file));
  //   }
  // };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      isDismissable={false}
      className="max-h-[640px] rounded-xl overflow-y-auto"
    >
      <ModalContent className="pt-4">
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col text-2xl text-center">
              Tạo nhóm lựa chọn mới
            </ModalHeader>
            <ModalBody className="overflow-y-auto">
              <form className="space-y-4">
                <Input
                  isRequired
                  type="text"
                  name="title"
                  label="Tên nhóm lựa chọn"
                  placeholder="Nhập tên nhóm lựa chọn"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.title && !!formik.errors.title}
                  errorMessage={formik.touched.title && formik.errors.title}
                />
                <RadioGroup
                  name="type"
                  label="Hình thức lựa chọn"
                  className="text-sm"
                  size="sm"
                  defaultValue="1"
                  isRequired
                  value={formik.values.type}
                  onChange={formik.handleChange}
                >
                  <div className="flex-row flex gap-4">
                    <Radio value="1">Chọn một</Radio>
                    <Radio value="2">Chọn nhiều</Radio>
                  </div>
                </RadioGroup>
                <RadioGroup
                  name="isRequire"
                  label="Lựa chọn bắt buộc?"
                  className="text-sm"
                  size="sm"
                  defaultValue="1"
                  isRequired
                  value={formik.values.isRequire}
                  onChange={formik.handleChange}
                >
                  <div className="flex-row flex gap-4">
                    <Radio value="1">Không</Radio>
                    <Radio value="2">Có</Radio>
                  </div>
                </RadioGroup>
                <Divider />
                <div className="flex justify-between items-center">
                  <p className="text-medium font-bold">Danh sách lựa chọn</p>
                  <Button
                    onClick={handleAddOption}
                    size="sm"
                    endContent={<PlusIcon size={16} />}
                    className="ml-auto"
                  >
                    Thêm
                  </Button>
                </div>
                {options.map((option, index) => (
                  <div key={index} className="flex justify-between gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files![0];
                        if (file) {
                          const newOptions = [...options];
                          newOptions[index].imageUrl = URL.createObjectURL(file);
                          setOptions(newOptions);
                        }
                      }}
                      id={`file-input-${index}`}
                      className="hidden"
                    />
                    <label htmlFor={`file-input-${index}`} className="cursor-pointer">
                      <Avatar
                        src={option.imageUrl || './images/'}
                        alt="Avatar"
                        className="rounded-full w-12 h-12"
                      />
                    </label>
                    <Input
                      isRequired
                      type="text"
                      name={`option-${index}-title`}
                      label={`Tên lựa chọn`}
                      placeholder="Nhập tên lựa chọn"
                      value={option.title}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].title = e.target.value;
                        setOptions(newOptions);
                      }}
                    />
                    <Input
                      type="text"
                      name={`option-${index}-price`}
                      label={`Giá bán`}
                      placeholder="Nhập giá"
                      value={option.price.toString()}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].price = Number(e.target.value);
                        setOptions(newOptions);
                      }}
                      className="w-1/2"
                      endContent={'VND'}
                    />
                  </div>
                ))}
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
