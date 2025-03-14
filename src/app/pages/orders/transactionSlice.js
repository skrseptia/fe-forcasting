import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAll,
  createItem,
  updateItem,
  deleteById,
  getId,
} from "./transactionAPI";

const initialState = {
  data: [],
  loading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  totalRecord: 0,
  selected: null,
  result: null,
  dataId: null,
};

export const fetchAll = createAsyncThunk(
  "orders/fetchAll",
  async (payload) => {
    const response = await getAll(payload);
    return response;
  }
);
export const fetchId = createAsyncThunk("orders/fetchId", async (payload) => {
  const response = await getId(payload);
  return response.data;
});

export const addItem = createAsyncThunk("orders/addItem", async (payload) => {
  const response = await createItem(payload);
  return response;
});

export const editItem = createAsyncThunk(
  "orders/editItem",
  async (payload) => {
    const response = await updateItem(payload);
    return response;
  }
);
export const removeById = createAsyncThunk(
  "orders/removeById",
  async (payload) => {
    const response = await deleteById(payload);
    return response;
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetData: () => initialState,
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchId.fulfilled, (state, action) => {
        state.loading = false;
        state.dataId = action.payload.data;
      })
      .addCase(addItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(editItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(editItem.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(removeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeById.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      });
  },
});

export const { resetData, setSelected } = ordersSlice.actions;

export const selectData = (state) => state.orders.data;
export const selectDataId = (state) => state.orders.dataId;
export const selectLoading = (state) => state.orders.loading;
export const selectError = (state) => state.orders.error;
export const selectResult = (state) => state.orders.result;

export default ordersSlice.reducer;
