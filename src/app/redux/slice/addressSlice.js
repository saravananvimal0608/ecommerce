import { apiRequest } from "@/app/utils/commonApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  address: [],
  loading: false,
  error: null,
};

export const fetchAddress = createAsyncThunk(
  "address/fetchAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/api/address/getAddress");
      return response.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch address",
      );
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
