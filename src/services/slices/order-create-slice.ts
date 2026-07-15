import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrdersApi } from '@api';

interface IOrderState {
  orderRequest: boolean;
  ordersIsGetting: boolean;
  orderModalData: TOrder | null;
  ordersByUser: TOrder[];
}

const initialState: IOrderState = {
  orderRequest: false,
  ordersIsGetting: false,
  orderModalData: null,
  ordersByUser: []
};

export const fetchOrdersByUser = createAsyncThunk(
  'get/ordersByUser',
  async () => await getOrdersApi()
);

export const postOrder = createAsyncThunk(
  'post/order',
  async (data: string[]) => {
    const newOrder = await orderBurgerApi(data);
    return {
      _id: newOrder.order._id,
      status: newOrder.order.status,
      name: newOrder.order.name,
      createdAt: newOrder.order.createdAt,
      updatedAt: newOrder.order.updatedAt,
      number: newOrder.order.number,
      ingredients: []
    };
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
      })

      .addCase(fetchOrdersByUser.pending, (state) => {
        state.ordersIsGetting = true;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.ordersByUser = action.payload;
        state.ordersIsGetting = false;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.ordersIsGetting = false;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
