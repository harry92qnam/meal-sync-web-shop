'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import { PROMOTION_TYPE, REPORT_STATUS } from '@/data/constants/constants';
import apiClient from '@/services/api-services/api-client';
import {
  formatDate,
  formatNumber,
  formatPhoneNumber,
  formatTimeToSeconds,
  toast,
} from '@/utils/MyUtils';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Input,
  Textarea,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import Image from 'next/image';
import useRefetch from '@/hooks/states/useRefetch';

// Define the new interface for the report detail data
interface ReportDetailData {
  id: number;
  orderId: number;
  title: string;
  content: string;
  imageUrls: string[];
  status: number;
  reason?: string;
  isReportedByCustomer: boolean;
  createdDate: string;
  shopDeliveryStaff: {
    fullName: string;
    phoneNumber: string;
    isShopOwnerShip: boolean;
  };
}

const validationSchema = yup.object().shape({
  reason: yup
    .string()
    .required('Vui lòng nhập lý do phản hồi')
    .max(250, 'Lý do chỉ có tối đa 250 ký tự'),
});

export default function ReportDetail({ params }: { params: { slug: number } }) {
  const [customerData, setCustomerData] = useState<ReportDetailData>();
  const [shopData, setShopData] = useState<ReportDetailData>();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { isRefetch, setIsRefetch } = useRefetch();

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmitReply(values);
    },
  });

  const handleSubmitReply = async (values: any) => {
    try {
      const uploadPromises = selectedImages.map((image) => uploadImage(image));
      const imageUrls = await Promise.all(uploadPromises);
      const payload = {
        replyReportId: customerData?.id,
        title: customerData?.title,
        content: formik.values.reason,
        images: imageUrls,
      };
      const responseData = await apiClient.post('shop-owner/order/report/reply', payload);
      if (!responseData.data.isSuccess) {
        toast('error', responseData.data.error.message);
      } else {
        setIsRefetch();
        formik.resetForm();
        setSelectedImages([]);
        setImagePreviews([]);
        toast('success', 'Phản hồi báo cáo thành công');
      }
      console.log(payload, 'payload');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get(`shop-owner/order/report/${params.slug}`);
        if (responseData.data.isSuccess) {
          responseData.data.value.forEach((element: any) => {
            if (element.isReportedByCustomer) {
              setCustomerData(element);
            } else {
              setShopData(element);
            }
          });
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    })();
  }, [isRefetch]);

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

  return (
    <MainLayout activeContentIndex={5}>
      <div className="md:col-span-1 pb-16">
        <Header title="Chi tiết báo cáo" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Quản lý báo cáo</BreadcrumbItem>
        <BreadcrumbItem>Chi tiết báo cáo</BreadcrumbItem>
      </Breadcrumbs>
      <div className="px-8 py-4 border-small shadow-md rounded-lg">
        <Chip
          className={`capitalize mb-4 ${
            customerData?.status === 1
              ? 'bg-gray-200 text-gray-600'
              : customerData?.status === 2
                ? 'bg-green-200 text-green-600'
                : 'bg-red-200 text-rose-600'
          }`}
          size="md"
          variant="flat"
        >
          {REPORT_STATUS.find((item) => item.key == customerData?.status)?.desc}
        </Chip>
        {customerData?.reason && (
          <span className="text-senary text-medium"> (Lý do: {customerData.reason})</span>
        )}
        <div className="flex flex-col mr-auto text-lg gap-2">
          <div className="flex gap-2 items-center">
            <p>Mã đơn hàng:</p>
            <p className="font-semibold">MS-{customerData?.orderId}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p>Loại báo cáo:</p>
            <p className="font-semibold">{customerData?.title}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p>Lý do cụ thể:</p>
            <p className="font-semibold">{customerData?.content}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p>Thời gian báo cáo:</p>
            <p className="font-bold">{formatTimeToSeconds(customerData?.createdDate ?? '')}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p>Hình ảnh chứng minh: </p>
            <div className="flex flex-wrap gap-2">
              {customerData?.imageUrls?.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Thông tin người giao hàng:</p>
            <div className="flex flex-col">
              <p>
                Tên người giao hàng:{' '}
                {customerData?.shopDeliveryStaff?.isShopOwnerShip
                  ? 'Tôi'
                  : customerData?.shopDeliveryStaff?.fullName}
              </p>
              <p>
                Số điện thoại:{' '}
                {formatPhoneNumber(customerData?.shopDeliveryStaff?.phoneNumber ?? '')}
              </p>
            </div>
          </div>
        </div>
        <Divider className="my-8" />
        {shopData ? (
          <div className="flex flex-col mr-auto text-lg gap-2">
            <div className="flex gap-2 items-center">
              <p>Nội dung phản hồi:</p>
              <p className="font-semibold">{shopData?.content}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Thời gian phản hồi:</p>
              <p className="font-bold">{formatTimeToSeconds(shopData?.createdDate ?? '')}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p>Hình ảnh chứng minh:</p>
              <div className="flex flex-wrap gap-2">
                {shopData?.imageUrls?.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <Textarea
              type="text"
              name="reason"
              label="Lý do"
              placeholder="Cung cấp lý do phản hồi"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.reason && !!formik.errors.reason}
              errorMessage={formik.touched.reason && formik.errors.reason}
            />
            <input
              type="file"
              accept="image/*"
              className="my-4"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length + selectedImages.length <= 5) {
                  setSelectedImages((prev) => [...prev, ...files]);
                  const newImagePreviews = files.map((file) => URL.createObjectURL(file));
                  setImagePreviews((prev) => [...prev, ...newImagePreviews]);
                } else {
                  toast('error', 'Bạn chỉ có thể tải lên tối đa 5 hình ảnh.');
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-lg m-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSelectedImages = selectedImages.filter((_, i) => i !== index);
                      const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
                      setSelectedImages(newSelectedImages);
                      setImagePreviews(newImagePreviews);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-senary text-white rounded-full text-center"
                  >
                    x
                  </button>
                  <p className="text-center">{selectedImages[index].name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                className="text-white"
                type="button"
                color="warning"
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                Phản hồi
              </Button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}