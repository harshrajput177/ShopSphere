import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAddressesApi, addAddressApi, updateAddressApi, deleteAddressApi } from "../../api/addressapi";

export const fetchAddresses  = createAsyncThunk("address/fetch",  async () => (await getAddressesApi()).data);
export const addAddress      = createAsyncThunk("address/add",    async (data) => (await addAddressApi(data)).data);
export const updateAddress   = createAsyncThunk("address/update", async ({ id, data }) => (await updateAddressApi(id, data)).data);
export const deleteAddress   = createAsyncThunk("address/delete", async (id) => { await deleteAddressApi(id); return id; });

const addressSlice = createSlice({
  name: "address",
  initialState: { addresses: [], selected: null, loading: false },
  reducers: {
    setSelectedAddress: (state, action) => { state.selected = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending,   (s) => { s.loading = true; })
      .addCase(fetchAddresses.fulfilled, (s, a) => { s.loading = false; s.addresses = a.payload; s.selected = a.payload.find(x => x.isDefault) || a.payload[0] || null; })
      .addCase(addAddress.fulfilled,     (s, a) => { s.addresses.unshift(a.payload); s.selected = a.payload; })
      .addCase(updateAddress.fulfilled,  (s, a) => { s.addresses = s.addresses.map(x => x._id === a.payload._id ? a.payload : x); })
      .addCase(deleteAddress.fulfilled,  (s, a) => { s.addresses = s.addresses.filter(x => x._id !== a.payload); });
  },
});

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;