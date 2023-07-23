import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAll,
  createItem,
  updateItem,
  deleteById,
  getId,
} from "./productsAPI";

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
  "products/fetchAll",
  async (payload) => {
    const response = await getAll(payload);
    return response;
  }
);
export const fetchId = createAsyncThunk("products/fetchId", async (payload) => {
  const response = await getId(payload);
  return response;
});

export const addItem = createAsyncThunk("products/addItem", async (payload) => {
  const response = await createItem(payload);
  return response;
});

export const editItem = createAsyncThunk(
  "products/editItem",
  async ({ params, id }) => {
    console.log(params, "payload");
    console.log(id, "id");
    const response = await updateItem(params, id);
    return response;
  }
);
export const removeById = createAsyncThunk(
  "products/removeById",
  async (id) => {
    const response = await deleteById(id);
    return response;
  }
);

export const productsSlice = createSlice({
  name: "products",
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

export const { resetData, setSelected } = productsSlice.actions;

export const selectData = (state) => state.products.data;
export const selectDataId = (state) => state.products.dataId;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectResult = (state) => state.products.result;

export default productsSlice.reducer;
