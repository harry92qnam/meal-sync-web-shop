import OrderModel from '../../types/models/OrderModel';
import apiClient from './api-client';
import createHttpService from './api-service';

export const endpoints = {
  ORDERS: 'moderator/orders',
};

export const orderApiService = createHttpService<OrderModel>(apiClient, endpoints.ORDERS);
