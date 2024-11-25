import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import PromotionModel from '@/types/models/PromotionModel';
import { formatPriceForInput, toast } from '@/utils/MyUtils';
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';

interface PromotionModalProps {
  promotion: PromotionModel | null;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Vui lòng nhập tên khuyến mãi')
    .max(30, 'Tên khuyến mãi chỉ có tối đa 30 ký tự'),
  usageLimit: yup.number().positive('Vui lòng nhập số lượng khuyến mãi'),
  description: yup.string().max(100, 'Mô tả chỉ có tối đa 100 ký tự'),
});

export default function PromotionUpdateModal({
  promotion,
  isOpen,
  onOpenChange,
}: PromotionModalProps) {
  const { setIsRefetch } = useRefetch();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [urlFile, setUrlFile] = useState(promotion?.bannerUrl);

  useEffect(() => {
    setUrlFile(promotion?.bannerUrl);
  }, [promotion]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: promotion?.title,
      description: promotion?.description,
      applyType: promotion?.applyType.toString(),
      amountRate: promotion?.amountRate,
      maximumApplyValue: promotion?.maximumApplyValue,
      minOrderValue: promotion?.minOrdervalue,
      amountValue: promotion?.amountValue,
      usageLimit: promotion?.usageLimit,
      startDate: promotion?.startDate,
      endDate: promotion?.endDate,
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  // console.log(parseDate(formik.initialValues.startDate ?? ''));

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

  const handleUpdate = async (values: any) => {
    try {
      const url = avatar ? await uploadImage(avatar) : urlFile;
      let payload;
      if (values.applyType === '1') {
        payload = {
          id: promotion?.id,
          title: values.title,
          description: values.description,
          amountRate: Number(values?.amountRate),
          maximumApplyValue: Number(values?.maximumApplyValue),
          amountValue: null,
          minOrderValue: Number(values?.minOrderValue),
          usageLimit: Number(values?.usageLimit),
          startDate: values.startDate,
          endDate: values.endDate,
          applyType: 1,
          status: 2,
          bannerUrl: url,
        };
      } else {
        payload = {
          id: promotion?.id,
          title: values.title,
          description: values.description,
          amountRate: null,
          maximumApplyValue: null,
          amountValue: Number(values?.amountValue),
          minOrderValue: Number(values?.minOrderValue),
          usageLimit: Number(values?.usageLimit),
          startDate: values.startDate,
          endDate: values.endDate,
          applyType: 2,
          status: 2,
          bannerUrl: url,
        };
      }
      if (!Number.isInteger(payload.usageLimit)) {
        toast('error', 'Số lượng khuyến mãi phải là số nguyên');
      } else if (!payload.title) {
        toast('error', 'Vui lòng nhập tên khuyến mãi');
      } else if (!payload.usageLimit) {
        toast('error', 'Vui lòng số lượng khuyến mãi');
      } else if (!payload.startDate) {
        toast('error', 'Vui lòng nhập ngày bắt đầu khuyến mãi');
      } else if (!payload.endDate) {
        toast('error', 'Vui lòng nhập kết thúc khuyến mãi');
      } else if (!payload.minOrderValue) {
        toast('error', 'Vui lòng nhập giá trị đơn hàng tối thiểu');
      } else if (payload.applyType === 1 && !payload.maximumApplyValue) {
        toast('error', 'Vui lòng nhập giá trị tối đa có thể giảm');
      } else if (payload.applyType === 1 && !payload.amountRate) {
        toast('error', 'Vui lòng nhập phần trăm giảm giá');
      } else if (payload.applyType === 2 && !payload.amountValue) {
        toast('error', 'Vui lòng nhập số tiền sẽ được giảm giá');
      } else if (!payload.bannerUrl) {
        toast('error', 'Vui lòng chọn hình ảnh khuyến mãi');
      } else {
        console.log(payload, 'payload');

        const responseData = await apiClient.put('shop-owner/promotion/info/update', payload);
        if (!responseData.data.isSuccess) {
          toast('error', responseData.data.error.message);
        } else {
          setIsRefetch();
          toast('success', responseData.data.value.message);
          onOpenChange(false);
          formik.resetForm();
          setAvatar(null);
          setUrlFile('');
        }
      }
    } catch (error: any) {
      toast('error', 'Vui lòng kiểm tra lại ngày bắt đầu và kết thúc');
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
      className="max-h-[640px] rounded-xl overflow-y-auto"
    >
      <ModalContent>
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col text-2xl text-center">
              Sửa đổi khuyến mãi
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <Avatar
                  src={urlFile || 'https://www.949vans.com/images/products/detail/E60195ABKS.2.jpg'}
                  alt="Promotion Image"
                  className={`rounded-full w-32 h-32 ${urlFile ? '' : 'border-medium'}`}
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
              <form className="space-y-4">
                <Input
                  isRequired
                  type="text"
                  name="title"
                  label="Tên khuyến mãi"
                  placeholder="Nhập tên khuyến mãi"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.title && !!formik.errors.title}
                  errorMessage={formik.touched.title && formik.errors.title}
                />
                <Input
                  isRequired
                  type="text"
                  name="usageLimit"
                  label="Số lượng khuyến mãi"
                  placeholder="Nhập số lượng khuyến mãi"
                  value={formik.values.usageLimit ? formik.values.usageLimit.toString() : ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.usageLimit && !!formik.errors.usageLimit}
                  errorMessage={formik.touched.usageLimit && formik.errors.usageLimit}
                />
                <div className="flex gap-1">
                  <div className="flex flex-col w-1/2">
                    <p className="text-sm ml-1">Thời gian bắt đầu</p>
                    <Input
                      name="startDate"
                      type="datetime-local"
                      required
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      // defaultValue={formik.initialValues.startDate}
                      fullWidth
                      isInvalid={formik.touched.startDate && !!formik.errors.startDate}
                      errorMessage={formik.touched.startDate && formik.errors.startDate}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <p className="text-sm ml-1">Thời gian kết thúc</p>
                    <Input
                      name="endDate"
                      type="datetime-local"
                      required
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      defaultValue={formik.initialValues.endDate}
                      fullWidth
                      isInvalid={formik.touched.endDate && !!formik.errors.endDate}
                      errorMessage={formik.touched.endDate && formik.errors.endDate}
                    />
                  </div>
                </div>
                <Textarea
                  type="text"
                  name="description"
                  label="Mô tả"
                  placeholder="Nhập mô tả khuyến mãi"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.description && !!formik.errors.description}
                  errorMessage={formik.touched.description && formik.errors.description}
                />
                <RadioGroup
                  name="applyType"
                  label="Hình thức khuyến mãi"
                  className="text-sm"
                  size="sm"
                  defaultValue="1"
                  isRequired
                  value={formik.values.applyType}
                  onChange={formik.handleChange}
                  isDisabled={true}
                >
                  <div className="flex-row flex gap-4">
                    <Radio value="1">Giảm giá theo %</Radio>
                    <Radio value="2">Giảm tiền trực tiếp</Radio>
                  </div>
                </RadioGroup>
                {formik.values.applyType === '1' ? (
                  <>
                    <Input
                      isRequired
                      type="text"
                      name="minOrderValue"
                      label="Giá trị đơn hàng tối thiểu"
                      placeholder="Nhập giá trị đơn hàng tối thiểu"
                      value={
                        formik.values.minOrderValue
                          ? formatPriceForInput(formik.values.minOrderValue.toString())
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        formik.setFieldValue('minOrderValue', value);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.minOrderValue && !!formik.errors.minOrderValue}
                      errorMessage={formik.touched.minOrderValue && formik.errors.minOrderValue}
                      endContent={'VND'}
                      isDisabled={true}
                    />
                    <Input
                      isRequired
                      type="text"
                      name="maximumApplyValue"
                      label="Giá trị tối đa có thể giảm"
                      placeholder="Nhập giá trị tối đa có thể giảm"
                      value={
                        formik.values.maximumApplyValue
                          ? formatPriceForInput(formik.values.maximumApplyValue.toString())
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        formik.setFieldValue('maximumApplyValue', value);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.maximumApplyValue && !!formik.errors.maximumApplyValue
                      }
                      errorMessage={
                        formik.touched.maximumApplyValue && formik.errors.maximumApplyValue
                      }
                      endContent={'VND'}
                      isDisabled={true}
                    />
                    <Input
                      isRequired
                      type="text"
                      name="amountRate"
                      label="Phần trăm giảm giá"
                      placeholder="Nhập phần trăm giảm giá"
                      value={
                        formik.values.amountRate
                          ? formatPriceForInput(formik.values.amountRate.toString())
                          : ''
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.amountRate && !!formik.errors.amountRate}
                      errorMessage={formik.touched.amountRate && formik.errors.amountRate}
                      endContent={'%'}
                      isDisabled={true}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      isRequired
                      type="text"
                      name="minOrderValue"
                      label="Giá trị đơn hàng tối thiểu"
                      placeholder="Nhập giá trị đơn hàng tối thiểu"
                      value={
                        formik.values.minOrderValue
                          ? formatPriceForInput(formik.values.minOrderValue.toString())
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        formik.setFieldValue('minOrderValue', value);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.minOrderValue && !!formik.errors.minOrderValue}
                      errorMessage={formik.touched.minOrderValue && formik.errors.minOrderValue}
                      endContent={'VND'}
                      isDisabled={true}
                    />
                    <Input
                      isRequired
                      type="text"
                      name="amountValue"
                      label="Số tiền được giảm giá"
                      placeholder="Nhập số tiền được giảm giá"
                      value={
                        formik.values.amountValue
                          ? formatPriceForInput(formik.values.amountValue.toString())
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        formik.setFieldValue('amountValue', value);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.amountValue && !!formik.errors.amountValue}
                      errorMessage={formik.touched.amountValue && formik.errors.amountValue}
                      endContent={'VND'}
                      isDisabled={true}
                    />
                  </>
                )}
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
