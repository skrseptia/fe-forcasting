import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAll, getAllMonthly, getArima, getExpo } from "./metodelogiAPI";

const initialState = {
  data: null,
  dataTable: [],
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
export const fetchmetodelogiTable = createAsyncThunk(
  "metodelogi/fetchmetodelogiTable",
  async (payload) => {
    const response = await getAllMonthly(payload);
    return response;
  }
);

export const fetchmetodelogiArima = createAsyncThunk(
  "metodelogi/fetchmetodelogiArima",
  async (payload) => {
    const response = await getArima(payload);
    return response;
  }
);


export const fetchmetodelogiExpo = createAsyncThunk(
  "metodelogi/fetchmetodelogiExpo",
  async (payload) => {
    const response = await getExpo(payload);
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
      })
      .addCase(fetchmetodelogiArima.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchmetodelogiArima.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
      })
      .addCase(fetchmetodelogiTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchmetodelogiTable.fulfilled, (state, action) => {
        state.loading = false;
        state.dataTable = action.payload.data.data;
      })
      .addCase(fetchmetodelogiExpo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchmetodelogiExpo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
      });
  },
});

export const { resetData, setSelected } = metodelogiSlice.actions;

export const selectmetodelogi = (state) => state.metodelogi.data;
export const selectmetodelogiTable = (state) => state.metodelogi.dataTable;
export const selectLoading = (state) => state.metodelogi.loading;
export const selectError = (state) => state.metodelogi.error;
export const selectPageNo = (state) => state.metodelogi.pageNo;
export const selectPageSize = (state) => state.metodelogi.pageSize;
export const selectTotalRecord = (state) => state.metodelogi.totalRecord;
export const selectSelected = (state) => state.metodelogi.selected;
export const selectResult = (state) => state.metodelogi.result;

export default metodelogiSlice.reducer;
