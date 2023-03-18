import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAll,
  createItem,
  updateItem,
  deleteById,
  getId,
} from "./merchantsAPI";

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
  "merchants/fetchAll",
  async (payload) => {
    const response = await getAll(payload);
    return response;
  }
);

export const fetchId = createAsyncThunk(
  "merchants/fetchId",
  async (payload) => {
    const response = await getId(payload);
    return response;
  }
);

export const addItem = createAsyncThunk(
  "merchants/addItem",
  async (payload) => {
    const response = await createItem(payload);
    return response;
  }
);

export const editItem = createAsyncThunk(
  "users/editItem",
  async ({ id, payload }) => {
    const response = await updateItem(id, payload);
    return response;
  }
);
export const removeById = createAsyncThunk(
  "merchants/removeById",
  async (payload) => {
    const response = await deleteById(payload);
    return response;
  }
);

export const merchantsSlice = createSlice({
  name: "merchants",
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
        state.data = action.payload.data.data;
      })
      .addCase(fetchId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchId.fulfilled, (state, action) => {
        state.loading = false;
        state.dataId = action.payload.data.data;
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

export const { resetData, setSelected } = merchantsSlice.actions;

export const selectData = (state) => state.merchants.data;
export const selectDataMerchants = (state) => state.merchants.dataMerchatns;
export const selectDataId = (state) => state.merchants.dataId;
export const selectLoading = (state) => state.merchants.loading;
export const selectError = (state) => state.merchants.error;
export const selectResult = (state) => state.merchants.result;

export default merchantsSlice.reducer;
