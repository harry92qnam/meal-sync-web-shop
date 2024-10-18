import ReportModel from '@/types/models/ReportModel';
import OrderModel from '../../types/models/OrderModel';
import apiClient from './api-client';
import createHttpService from './api-service';
import CategoryModel from '@/types/models/CategoryModel';
import ProductModel from '@/types/models/ProductModel';
import PromotionModel from '@/types/models/PromotionModel';
import StaffModel from '@/types/models/StaffModel';
import OptionGroupModel from '@/types/models/OptionGroupModel';

export const endpoints = {
  ORDERS: 'shop/orders',
  REPORTS: 'shop/reports',
  PRODUCTS: 'shop/products',
  OPTIONS: 'shop/options',
  CATEGORIES: 'shop/categories',
  PROMOTIONS: 'shop/promotions',
  STAFFS: 'shop/staffs',
};

export const orderApiService = createHttpService<OrderModel>(apiClient, endpoints.ORDERS);
export const reportApiService = createHttpService<ReportModel>(apiClient, endpoints.REPORTS);
export const productApiService = createHttpService<ProductModel>(apiClient, endpoints.PRODUCTS);
export const optionApiService = createHttpService<OptionGroupModel>(apiClient, endpoints.OPTIONS);
export const categoryApiService = createHttpService<CategoryModel>(apiClient, endpoints.CATEGORIES);
export const promotionApiService = createHttpService<PromotionModel>(
  apiClient,
  endpoints.PROMOTIONS,
);
export const staffApiService = createHttpService<StaffModel>(apiClient, endpoints.STAFFS);
