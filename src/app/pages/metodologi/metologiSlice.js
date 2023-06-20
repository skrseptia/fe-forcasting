import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAll } from "./metodelogiAPI";

const initialState = {
  data: null,
  loading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  totalRecord: 0,
  selected: null,
  result: null,
  dataId: null,
};

export const fetchmetodelogi = createAsyncThunk(
  "metodelogi/fetchmetodelogi",
  async (payload) => {
    const response = await getAll(payload);
    return response;
  }
);

export const metodelogiSlice = createSlice({
  name: "metodelogi",
  initialState,
  reducers: {
    resetData: () => initialState,
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchmetodelogi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchmetodelogi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
      });
  },
});

export const { resetData, setSelected } = metodelogiSlice.actions;

export const selectmetodelogi = (state) => state.metodelogi.data;
export const selectLoading = (state) => state.metodelogi.loading;
export const selectError = (state) => state.metodelogi.error;
export const selectPageNo = (state) => state.metodelogi.pageNo;
export const selectPageSize = (state) => state.metodelogi.pageSize;
export const selectTotalRecord = (state) => state.metodelogi.totalRecord;
export const selectSelected = (state) => state.metodelogi.selected;
export const selectResult = (state) => state.metodelogi.result;

export default metodelogiSlice.reducer;
