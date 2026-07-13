import type { RootState } from '../store';

export const getFeedsLoadingStatus = (state: RootState) =>
  state.feedsOrders.isLoading;

export const getFeedsOrders = (state: RootState) => state.feedsOrders.orders;

export const getOrderByNumber = (state: RootState) =>
  state.feedsOrders.orderByNumber;

export const getFeedsTotal = (state: RootState) => state.feedsOrders.total;

export const getFeedsTotalToday = (state: RootState) =>
  state.feedsOrders.totalToday;

export const getFeedsError = (state: RootState) => state.feedsOrders.error;
