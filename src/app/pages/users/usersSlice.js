import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAll, createItem, updateItem, deleteById, getId } from "./usersAPI";

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

export const fetchAll = createAsyncThunk("users/fetchAll", async (payload) => {
  const response = await getAll(payload);
  return response;
});
export const fetchId = createAsyncThunk("users/fetchId", async (payload) => {
  const response = await getId(payload);
  return response;
});

export const addItem = createAsyncThunk("users/addItem", async (payload) => {
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
  "users/removeById",
  async (payload) => {
    const response = await deleteById(payload);
    return response;
  }
);

export const usersSlice = createSlice({
  name: "users",
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

export const { resetData, setSelected } = usersSlice.actions;

export const selectData = (state) => state.users.data;
export const selectDataId = (state) => state.users.dataId;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;
export const selectResult = (state) => state.users.result;

export default usersSlice.reducer;
