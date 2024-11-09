import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import OptionGroupModel from '@/types/models/OptionGroupModel';
import { formatPriceForInput, toast } from '@/utils/MyUtils';
import {
  Avatar,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';

interface ProductModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên món ăn').max(30, 'Tên món chỉ có tối đa 30 ký tự'),
  price: yup.number().positive('Vui lòng nhập giá bán'),
  description: yup.string().max(100, 'Mô tả chỉ có tối đa 100 ký tự'),
});

type OperatingSlot = {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  isReceivingOrderPaused: boolean;
  frameFormat: string;
};

type ShopCategory = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  createdDate: string;
  numberFoodLinked: number;
};

type PlatCategory = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
};

export default function ProductCreateModal({ isOpen, onOpenChange }: ProductModalProps) {
  const { setIsRefetch } = useRefetch();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [urlFile, setUrlFile] = useState('');
  const [operatingSlots, setOperatingSlots] = useState<OperatingSlot[]>([]);
  const [platformCategories, setPlatformCategories] = useState<PlatCategory[]>([]);
  const [shopCategories, setShopCategories] = useState<ShopCategory[]>([]);
  const [optionGroups, setOptionGroups] = useState<OptionGroupModel[]>([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      operatingSlots: [],
      platformCategoryId: 0,
      shopCategoryId: 0,
      description: '',
      optionGroups: [],
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [operatingSlots, platformCategories, shopCategories, optionGroups] =
          await Promise.all([
            apiClient.get('shop-owner/operating-slot'),
            apiClient.get('platform-category'),
            apiClient.get('web/shop-owner/category'),
            apiClient.get('shop-owner/option-group'),
          ]);
        setOperatingSlots(operatingSlots.data.value);
        setPlatformCategories(platformCategories.data.value);
        setShopCategories(shopCategories.data.value.items);
        setOptionGroups(optionGroups.data.value.items);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [isOpen]);

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
    try {
      const url = await uploadImage(avatar);
      const payload = {
        name: values.name,
        description: values?.description,
        price: Number(values?.price),
        imgUrl: url,
        operatingSlots: Array.from(values.operatingSlots).map(Number),
        shopCategoryId: Number(values.shopCategoryId.currentKey),
        platformCategoryId: Number(values.platformCategoryId.currentKey),
        optionGroups: Array.from(values.optionGroups).map(Number),
        status: 1,
      };

      console.dir(payload);
      console.log(optionGroups);

      const responseData = await apiClient.post('shop-owner/food/create', payload);
      console.log(responseData);
      if (!responseData.data.isSuccess) {
        toast('error', responseData.data.error.message);
      } else {
        setIsRefetch();
        toast('success', 'Tạo món ăn thành công');
        onOpenChange(false);
        formik.resetForm();
        setAvatar(null);
        setUrlFile('');
      }
    } catch (error: any) {
      toast('error', 'Thiếu thông tin sản phẩm!');
    }
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
    formik.resetForm();
    setAvatar(null);
    setUrlFile('');
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setAvatar(file);
      setUrlFile(URL.createObjectURL(file));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      isDismissable={false}
      className="max-h-[640px] rounded-xl"
    >
      <ModalContent className="pt-4">
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col text-2xl text-center">
              Tạo thực đơn mới
            </ModalHeader>
            <ModalBody className="overflow-y-auto">
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
              <form className="space-y-4">
                <Input
                  isRequired
                  type="text"
                  name="name"
                  label="Tên món ăn"
                  placeholder="Nhập tên món ăn"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                  errorMessage={formik.touched.name && formik.errors.name}
                />
                <Input
                  isRequired
                  type="text"
                  name="price"
                  label="Giá bán"
                  placeholder="Nhập giá món ăn"
                  value={
                    formik.values.price ? formatPriceForInput(formik.values.price.toString()) : ''
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\./g, '');
                    formik.setFieldValue('price', rawValue);
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.price && !!formik.errors.price}
                  errorMessage={formik.touched.price && formik.errors.price}
                  endContent={'VND'}
                />
                <Select
                  selectionMode="multiple"
                  isRequired
                  name="operatingSlots"
                  label="Khung giờ mở bán"
                  onSelectionChange={(value) => formik.setFieldValue('operatingSlots', value)}
                  isMultiline
                  renderValue={(selected) => (
                    <div className="flex flex-wrap gap-2">
                      {selected.map((slot) => (
                        <Chip key={slot.key} color="success" className="text-septenary">
                          {slot.rendered}
                        </Chip>
                      ))}
                    </div>
                  )}
                >
                  {operatingSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.frameFormat}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  selectionMode="single"
                  isRequired
                  name="platformCategoryId"
                  label="Danh mục hệ thống"
                  onSelectionChange={(value) => formik.setFieldValue('platformCategoryId', value)}
                >
                  {platformCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  selectionMode="single"
                  isRequired
                  name="shopCategoryId"
                  label="Danh mục cửa hàng"
                  onSelectionChange={(value) => formik.setFieldValue('shopCategoryId', value)}
                >
                  {shopCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  selectionMode="multiple"
                  name="optionGroups"
                  label="Nhóm lựa chọn"
                  isMultiline
                  onSelectionChange={(value) => formik.setFieldValue('optionGroups', value)}
                  renderValue={(selected) => (
                    <div className="flex flex-wrap gap-2">
                      {selected.map((option) => (
                        <Chip key={option.key} color="success">
                          {option.rendered}
                        </Chip>
                      ))}
                    </div>
                  )}
                >
                  {optionGroups.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.title}
                    </SelectItem>
                  ))}
                </Select>
                <Textarea
                  type="text"
                  name="description"
                  label="Mô tả"
                  placeholder="Nhập mô tả món ăn"
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
