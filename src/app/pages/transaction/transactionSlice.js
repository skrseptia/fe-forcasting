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
  "transaction/fetchAll",
  async (payload) => {
    const response = await getAll(payload);
    return response;
  }
);

export const fetchId = createAsyncThunk(
  "transaction/fetchId",
  async (payload) => {
    const response = await getId(payload);
    return response;
  }
);

export const addItem = createAsyncThunk(
  "transaction/addItem",
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
  "transaction/removeById",
  async (payload) => {
    const response = await deleteById(payload);
    return response;
  }
);

export const transactionSlice = createSlice({
  name: "transaction",
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
        state.pageNo = action.payload.data.page;
        state.pageSize = action.payload.data.page_size;
        state.totalRecord = action.payload.data.total_rows;
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

export const { resetData, setSelected } = transactionSlice.actions;

export const selectData = (state) => state.transaction.data;
export const selectDatatransaction = (state) => state.transaction.dataMerchatns;
export const selectDataId = (state) => state.transaction.dataId;
export const selectLoading = (state) => state.transaction.loading;
export const selectError = (state) => state.transaction.error;
export const selectResult = (state) => state.transaction.result;
export const selectPageNo = (state) => state.transaction.pageNo;
export const selectPageSize = (state) => state.transaction.pageSize;
export const selectTotalRecord = (state) => state.transaction.totalRecord;

export default transactionSlice.reducer;
