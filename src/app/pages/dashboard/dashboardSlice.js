import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAll,
  createItem,
  updateItem,
  deleteById,
  getId,
} from "./dashboardAPI";

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

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (payload) => {
    const response = await getAll(payload);
    return response;
  }
);
export const fetchDashboardId = createAsyncThunk(
  "dashboard/PurchaseChaseId",
  async (payload) => {
    const response = await getId(payload);
    return response.data;
  }
);

export const addItem = createAsyncThunk(
  "dashboard/addItem",
  async (payload) => {
    const response = await createItem(payload);
    return response;
  }
);

export const editItem = createAsyncThunk(
  "dashboard/editItem",
  async (payload) => {
    const response = await updateItem(payload);
    return response;
  }
);
export const removeById = createAsyncThunk(
  "dashboard/removeById",
  async (payload) => {
    const response = await deleteById(payload);
    return response;
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetData: () => initialState,
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pageNo = action.payload.data.pageNo;
        state.pageSize = action.payload.data.pageSize;
        state.totalRecord = action.payload.data.totalRecord;
      })
      .addCase(fetchDashboardId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardId.fulfilled, (state, action) => {
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

export const { resetData, setSelected } = dashboardSlice.actions;

export const selectDashboard = (state) => state.dashboard.data;
export const selectDashboardId = (state) => state.dashboard.dataId;
export const selectLoading = (state) => state.dashboard.loading;
export const selectError = (state) => state.dashboard.error;
export const selectPageNo = (state) => state.dashboard.pageNo;
export const selectPageSize = (state) => state.dashboard.pageSize;
export const selectTotalRecord = (state) => state.dashboard.totalRecord;
export const selectSelected = (state) => state.dashboard.selected;
export const selectResult = (state) => state.dashboard.result;

export default dashboardSlice.reducer;
