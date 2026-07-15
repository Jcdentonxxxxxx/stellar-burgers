import type { RootState } from '../store';

export const getOrderRequest = (state: RootState) => state.order.orderRequest;
export const getOrdersGettingStatus = (state: RootState) =>
  state.order.ordersIsGetting;
export const getOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const getOrdersByUser = (state: RootState) => state.order.ordersByUser;
