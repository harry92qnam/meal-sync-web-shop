'use client';
import Header from '@/components/common/Header';
import MainLayout from '@/components/layout/MainLayout';
import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import OrderModel from '@/types/models/OrderModel';
import ReviewDetailModel from '@/types/models/ReviewDetailModel';
import {
  formatCurrency,
  formatNumber,
  formatTimeToSeconds,
  isLocalImage,
  toast,
} from '@/utils/MyUtils';
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Divider, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  comment: yup
    .string()
    .required('Vui lòng nhập nội dung phản hồi')
    .max(250, 'Nội dung chỉ có tối đa 250 ký tự'),
});

type Report = {
  id: number;
  name: string;
  avatar: string;
  reviewer: number;
  rating: number;
  comment: string;
  imageUrls?: string[];
  createdDate: string;
};

export default function ReviewDetail({ params }: { params: { slug: number } }) {
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailModel[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderModel>();
  const router = useRouter();
  const { isRefetch, setIsRefetch } = useRefetch();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [customerData, setCustomerData] = useState<Report>();
  const [shopData, setShopData] = useState<Report>();

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmitReply(values);
    },
  });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const responseData = await apiClient.get(`shop-onwer/review/order/${params.slug}`);
        if (responseData.data.isSuccess) {
          setReviewDetail(responseData.data?.value);
          console.log(responseData.data.value[0].reviews);

          responseData.data.value[0].reviews.forEach((element: Report) => {
            if (element.reviewer === 1) {
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
    };
    fetchReview();
  }, [isRefetch]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!reviewDetail[0]) return;
      try {
        const responseData = await apiClient.get(
          `shop-owner-staff/order/${reviewDetail[0].orderId}`,
        );
        if (responseData.data.isSuccess) {
          setOrderDetail(responseData.data?.value);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    };
    fetchOrder();
  }, [isRefetch, reviewDetail]);

  const handleSubmitReply = async (values: { comment: string }) => {
    try {
      const uploadPromises = selectedImages.map((image) => uploadImage(image));
      const imageUrls = await Promise.all(uploadPromises);
      const payload = {
        orderId: reviewDetail[0]?.orderId,
        comment: values.comment,
        imageUrl: imageUrls,
      };
      console.log(payload);

      const responseData = await apiClient.post('shop-onwer/review', payload);

      if (!responseData.data.isSuccess) {
        toast('error', responseData.data.error.message);
      } else {
        setIsRefetch();
        formik.resetForm();
        setSelectedImages([]);
        setImagePreviews([]);
        toast('success', 'Phản hồi đánh giá thành công');
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };

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
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };

  return (
    <MainLayout activeContentIndex={8}>
      <div className="md:col-span-1 pb-16">
        <Header title="Chi tiết danh mục" />
      </div>
      <Breadcrumbs size="lg" className="pl-4 py-2">
        <BreadcrumbItem onClick={() => router.back()}>Đánh giá sản phẩm</BreadcrumbItem>
        <BreadcrumbItem>Chi tiết đánh giá</BreadcrumbItem>
      </Breadcrumbs>
      <div className="px-4 py-2">
        <div className="px-8 py-4 shadow-md border-small rounded-lg">
          <div className="flex flex-col mr-auto text-lg gap-2">
            <strong className="text-xl text-cyan-500">Thông tin đơn hàng:</strong>
            {orderDetail?.orderDetails?.map((food) => (
              <div key={food.id}>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="flex gap-4">
                      {!isLocalImage(food.imageUrl) && (
                        <Image
                          src={food.imageUrl}
                          alt="Food image"
                          width={100}
                          height={100}
                          className="border-small rounded-lg w-28 h-28 object-cover"
                        />
                      )}
                      <div className="flex flex-col justify-center">
                        <div className="text-lg">
                          {food.name} ({formatCurrency(food.basicPrice)})
                          <p>
                            <strong>x{food.quantity}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    {food.optionGroups.map(
                      (q) =>
                        q.options?.length > 0 && (
                          <>
                            <p className="font-bold text-lg text-slate-500">
                              {q.optionGroupTitle}:
                            </p>
                            {q.options.map((option) =>
                              option.price > 0 ? (
                                <p className="text-slate-500 text-medium" key={option.optionTitle}>
                                  - {option.optionTitle} (+
                                  {formatCurrency(option.price)}) x {formatNumber(food.quantity)}
                                </p>
                              ) : (
                                <p className="text-slate-500 text-medium" key={option.optionTitle}>
                                  - {option.optionTitle}
                                </p>
                              ),
                            )}
                          </>
                        ),
                    )}
                  </div>
                  <strong className="text-xl">{formatCurrency(food.totalPrice)}</strong>
                </div>
                {food.note && (
                  <p>
                    <strong>Ghi chú món ăn: </strong> <span>{food.note}</span>
                  </p>
                )}
              </div>
            ))}
            {orderDetail?.note && (
              <p className="py-4">
                <strong>Ghi chú đơn hàng: </strong>
                {orderDetail?.note
                  .split('\n')
                  .map((item, index) => <span key={index}>{item}</span>)}
              </p>
            )}
            <Divider className="my-1" />
            <div className="flex flex-col ml-auto w-1/3 pt-4 text-lg">
              <div className="flex justify-between">
                <p>Tổng hoá đơn:</p>
                <p className="">{formatCurrency(orderDetail?.totalPrice ?? 0)}</p>
              </div>
              <div className="flex justify-between">
                <p>Giảm giá:</p>
                <p className="">{formatCurrency(orderDetail?.totalPromotion ?? 0)}</p>
              </div>
              <div className="flex justify-between text-primary font-bold text-xl">
                <p>Thành tiền:</p>
                <p>
                  {formatCurrency(
                    (orderDetail?.totalPrice ?? 0) - (orderDetail?.totalPromotion ?? 0),
                  )}
                </p>
              </div>
            </div>
            <Divider className="my-1" />
            <div>
              <strong className="text-xl text-cyan-500">Đánh giá sản phẩm:</strong>

              <div className="py-2" key={customerData?.id}>
                <div className="flex">
                  <div className="flex items-center gap-2 pb-2">
                    <Avatar
                      src={
                        customerData?.avatar ||
                        'https://www.949vans.com/images/products/detail/E60195ABKS.2.jpg'
                      }
                      alt="Category Image"
                      className={`rounded-full w-12 h-12 border-small`}
                    />
                    <div className="flex flex-col">
                      <p className="text-lg font-bold">{customerData?.name}</p>
                      <p className="text-sm text-gray-400">
                        {formatTimeToSeconds(customerData?.createdDate ?? '')}
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }, (value, index) => (
                      <FaStar
                        key={index}
                        color={
                          index < Math.floor(customerData?.rating ?? 0) ? '#facc15' : '#e4e5e9'
                        }
                      />
                    ))}
                    {customerData && customerData?.rating % 1 !== 0 && (
                      <FaStar
                        color="#facc15"
                        style={{ width: '1em', clipPath: 'inset(0 50% 0 0)' }} // Half star effect
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-medium">Nội dung đánh giá:</p>
                  <p>{customerData?.comment}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-wrap gap-2">
                    {customerData?.imageUrls?.map(
                      (url, index) =>
                        !isLocalImage(url) && (
                          <Image
                            key={index}
                            src={url}
                            alt={`Image ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-lg w-44 h-44 object-cover border-small"
                          />
                        ),
                    )}
                  </div>
                </div>
              </div>

              {shopData ? (
                <div className="flex shadow-sm border-small rounded-lg px-4 py-2 ml-4 flex-col mr-auto text-lg gap-2">
                  <div className="flex items-center gap-2 pb-2">
                    <Avatar
                      src={
                        shopData?.avatar ||
                        'https://www.949vans.com/images/products/detail/E60195ABKS.2.jpg'
                      }
                      alt="Shop Image"
                      className={`rounded-full w-12 h-12 border-small`}
                    />
                    <div className="flex flex-col">
                      <p className="text-lg font-bold">{shopData?.name}</p>
                      <p className="text-sm text-gray-400">
                        {formatTimeToSeconds(shopData?.createdDate ?? '')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-medium">Nội dung phản hồi:</p>
                    <p>{shopData?.comment}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-wrap gap-2">
                      {shopData?.imageUrls?.map(
                        (url, index) =>
                          !isLocalImage(url) && (
                            <Image
                              key={index}
                              src={url}
                              alt={`Image ${index + 1}`}
                              width={100}
                              height={100}
                              className="rounded-lg w-44 h-44 object-cover border-small"
                            />
                          ),
                      )}
                    </div>
                  </div>
                </div>
              ) : !reviewDetail[0]?.isAllowShopReply ? (
                <p className="text-red-500 font-bold text-xl text-center">
                  Báo cáo này đã quá thời gian phản hồi
                </p>
              ) : (
                <>
                  <Textarea
                    type="text"
                    name="comment"
                    label="Nội dung phản hồi"
                    placeholder="Cung cấp nội dung phản hồi"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.comment && !!formik.errors.comment}
                    errorMessage={formik.touched.comment && formik.errors.comment}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="my-4"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + selectedImages.length <= 3) {
                        setSelectedImages((prev) => [...prev, ...files]);
                        const newImagePreviews = files.map((file) => URL.createObjectURL(file));
                        setImagePreviews((prev) => [...prev, ...newImagePreviews]);
                      } else {
                        toast('error', 'Bạn chỉ có thể tải lên tối đa 3 hình ảnh.');
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
