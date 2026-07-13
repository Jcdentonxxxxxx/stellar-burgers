import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

type TFeedsOrders = TOrdersData & {
  isLoading: boolean;
  error: string | undefined;
  orderByNumber: TOrder[];
};

const initialState: TFeedsOrders = {
  orders: [],
  orderByNumber: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: ''
};

export const fetchNumberOrder = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const fetchFeedsOrders = createAsyncThunk(
  'feeds/fetch',
  async () => await getFeedsApi()
);

export const feedsOrdersSlice = createSlice({
  name: 'feedsOrders',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsOrders.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchFeedsOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedsOrders.rejected, (state, action) => {
        state.isLoading = false;
        const err = action.error;
        if (err instanceof Error) {
          state.error = err.message;
        } else if (err && typeof err === 'object') {
          const message = (err as any).message || (err as any).error;
          state.error = message ? String(message) : 'Ошибка загрузки';
        } else {
          state.error = 'Ошибка загрузки заказов';
        }
      })
      .addCase(fetchNumberOrder.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchNumberOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderByNumber = action.payload.orders;
      })
      .addCase(fetchNumberOrder.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});
