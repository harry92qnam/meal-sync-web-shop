import ReportModel from '@/types/models/ReportModel';
import OrderModel from '../../types/models/OrderModel';
import apiClient from './api-client';
import createHttpService from './api-service';
import CategoryModel from '@/types/models/CategoryModel';
import ProductModel from '@/types/models/ProductModel';
import PromotionModel from '@/types/models/PromotionModel';
import StaffModel from '@/types/models/StaffModel';
import OptionGroupModel from '@/types/models/OptionGroupModel';
import PackageModel from '@/types/models/PackageModel';
import { getFormattedCurrentTime } from '@/utils/MyUtils';

export const endpoints = {
  ORDERS: 'web/shop-owner/order',
  ALL: 'web/shop-owner/delivery-package',
  OWNER: 'web/shop-owner/delivery-package/own',
  REPORTS: 'shop-owner/order/report',
  PRODUCTS: 'web/shop-owner/food',
  OPTIONS: 'shop-owner/option-group',
  CATEGORIES: 'web/shop-owner/category',
  CATEGORY_IMAGE_UPLOAD: 'shop-owner/category/upload',
  PROMOTIONS: 'shop-owner/promotion',
  STAFFS: 'shop-owner/delivery-staff',
};

export const orderApiService = (statuses: number[]) => {
  const startTime = statuses.includes(1) || statuses.includes(3) ? getFormattedCurrentTime() : 0;
  const statusQuery = statuses.map((status) => `status=${status}`).join('&');
  return createHttpService<OrderModel>(
    apiClient,
    `${endpoints.ORDERS}?StartTime=${startTime}&EndTime=2400&${statusQuery}`,
  );
};
export const allOrderApiService = (currentTime: number, date: string) => {
  return createHttpService<PackageModel>(
    apiClient,
    `${endpoints.ALL}?StartTime=${currentTime}&EndTime=2400&IntendedReceiveDate=${date}`,
  );
};
export const ownerOrderApiService = (currentTime: number, date: string) => {
  return createHttpService<PackageModel>(
    apiClient,
    `${endpoints.OWNER}?StartTime=${currentTime}&EndTime=2400&IntendedReceiveDate=${date}&Status=1&Status=2&Status=3`,
  );
};
export const preparingOrderApiService = (
  startTime: number = 0,
  endTime: number = 0,
  date: string,
) => {
  return createHttpService<OrderModel>(
    apiClient,
    `${endpoints.ORDERS}?StartTime=${startTime}&EndTime=${endTime}&IntendedReceiveDate=${date}&status=5&status=6&status=7`,
  );
};
export const reportApiService = createHttpService<ReportModel>(apiClient, endpoints.REPORTS);
export const productApiService = createHttpService<ProductModel>(apiClient, endpoints.PRODUCTS);
export const optionApiService = createHttpService<OptionGroupModel>(apiClient, endpoints.OPTIONS);
export const categoryApiService = createHttpService<CategoryModel>(apiClient, endpoints.CATEGORIES);
export const promotionApiService = createHttpService<PromotionModel>(
  apiClient,
  endpoints.PROMOTIONS,
);
export const staffApiService = createHttpService<StaffModel>(apiClient, endpoints.STAFFS);
