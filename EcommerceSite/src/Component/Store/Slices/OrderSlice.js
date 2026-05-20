import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderApi, getMyOrdersApi, getOrderByIdApi,
  cancelOrderApi, createRazorpayOrderApi, verifyPaymentApi,
} from "../../api/Orderapi";

// ── Place order (COD) ────────────────────────────────────────
export const placeOrder = createAsyncThunk(
  "order/place",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await createOrderApi(orderData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order failed");
    }
  }
);

// ── Razorpay: create + verify ────────────────────────────────
export const placeRazorpayOrder = createAsyncThunk(
  "order/razorpay",
  async ({ orderData, totalAmount }, { rejectWithValue }) => {
    try {
      // Step 1: Razorpay order create
      const rpRes = await createRazorpayOrderApi(totalAmount);
      const { orderId: razorpayOrderId, amount, currency, key } = rpRes.data;

      // Step 2: Our DB mein order save (Pending)
      const dbOrderRes = await createOrderApi({
        ...orderData,
        razorpayOrderId,
        paymentMethod: "Razorpay",
      });
      const dbOrder = dbOrderRes.data;

      // Step 3: Razorpay checkout open karo (Promise return)
      return new Promise((resolve, reject) => {
        const options = {
          key,
          amount,
          currency,
          name:        "Your Store",
          description: "Order Payment",
          order_id:    razorpayOrderId,
          handler: async (response) => {
            try {
              // Step 4: Verify signature
              const verifyRes = await verifyPaymentApi({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                orderId:             dbOrder._id,
              });
              resolve(verifyRes.data.order);
            } catch (e) {
              reject(e);
            }
          },
          prefill: {
            name:    orderData.shippingAddress.name,
            contact: orderData.shippingAddress.phone,
          },
          theme: { color: "#111111" },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment failed");
    }
  }
);

// ── Fetch my orders ──────────────────────────────────────────
export const fetchMyOrders = createAsyncThunk("order/fetchAll", async () => {
  const res = await getMyOrdersApi();
  return res.data;
});

// ── Fetch single order ───────────────────────────────────────
export const fetchOrderById = createAsyncThunk("order/fetchOne", async (id) => {
  const res = await getOrderByIdApi(id);
  return res.data;
});

// ── Cancel order ─────────────────────────────────────────────
export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await cancelOrderApi(id, reason);
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Cancel failed");
    }
  }
);

// ── Slice ────────────────────────────────────────────────────
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders:       [],
    activeOrder:  null,   // detail page ke liye
    placedOrder:  null,   // success page ke liye
    loading:      false,
    placing:      false,
    error:        null,
  },
  reducers: {
    clearPlacedOrder: (state) => { state.placedOrder = null; },
    clearError:       (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // place COD
      .addCase(placeOrder.pending,   (s) => { s.placing = true; s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => { s.placing = false; s.placedOrder = a.payload; s.orders.unshift(a.payload); })
      .addCase(placeOrder.rejected,  (s, a) => { s.placing = false; s.error = a.payload; })

      // razorpay
      .addCase(placeRazorpayOrder.pending,   (s) => { s.placing = true; s.error = null; })
      .addCase(placeRazorpayOrder.fulfilled, (s, a) => { s.placing = false; s.placedOrder = a.payload; s.orders.unshift(a.payload); })
      .addCase(placeRazorpayOrder.rejected,  (s, a) => { s.placing = false; s.error = a.payload; })

      // fetch all
      .addCase(fetchMyOrders.pending,   (s) => { s.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchMyOrders.rejected,  (s) => { s.loading = false; })

      // fetch one
      .addCase(fetchOrderById.pending,   (s) => { s.loading = true; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.loading = false; s.activeOrder = a.payload; })

      // cancel
      .addCase(cancelOrder.fulfilled, (s, a) => {
        s.orders      = s.orders.map(o => o._id === a.payload._id ? a.payload : o);
        s.activeOrder = a.payload;
      });
  },
});

export const { clearPlacedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;