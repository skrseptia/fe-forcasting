import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAll, createItem, updateItem, deleteById, getId } from "./uomAPI";

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

export const fetchAll = createAsyncThunk("uom/fetchAll", async (payload) => {
  const response = await getAll(payload);
  return response;
});

export const fetchId = createAsyncThunk("uom/fetchId", async (payload) => {
  const response = await getId(payload);
  return response;
});

export const addItem = createAsyncThunk("uom/addItem", async (payload) => {
  const response = await createItem(payload);
  return response;
});

export const editItem = createAsyncThunk(
  "users/editItem",
  async ({ id, payload }) => {
    const response = await updateItem(id, payload);
    return response;
  }
);
export const removeById = createAsyncThunk(
  "uom/removeById",
  async (payload) => {
    const response = await deleteById(payload);
    return response;
  }
);

export const merchantsSlice = createSlice({
  name: "uom",
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

export const selectData = (state) => state.uom.data;
export const selectDataId = (state) => state.uom.dataId;
export const selectLoading = (state) => state.uom.loading;
export const selectError = (state) => state.uom.error;
export const selectResult = (state) => state.uom.result;

export default merchantsSlice.reducer;
