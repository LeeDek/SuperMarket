import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { Order, ProductsList } from "../../rami-types";

export const getUserOrdersAPI = createAsyncThunk<Order[] | null, number>(
  "getUserOrdersListAPI",
  async (user_id: number) => {
    try {
      const response = await axios.get(
        `/api/orders/get-user-orders/${user_id}`
      );
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getUserOrdersListAPI()");
      }

      return results;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
);

export const getUserOrderCartDetailsAPI = createAsyncThunk<
  ProductsList[] | null,
  number
>("getUserOrderCartDetailsAPI", async (cart_id: number) => {
  try {
    const response = await axios.get(
      `/api/orders/get-user-order-cart-details/${cart_id}`
    );

    const { ok, results } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials getUserOrderCartsDetailsAPI()");
    }

    return results as ProductsList[];
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getOrderByIdAPI = createAsyncThunk<Order | null, number>(
  "getOrderByIdAPI",
  async (order_id: number) => {
    try {
      const response = await axios.get(`/api/orders/${order_id}`);
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getOrderByIdAPI()");
      }

      const order = results[0] as Order;
      return order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
);

export const addNewOrderAPI = createAsyncThunk<number | null, Order>(
  "addNewOrderAPI",
  async (newOrder: Order) => {
    try {
      const response = await axios.post("/api/orders/add-new-order", newOrder);
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials addNewOrderAPI()");
      }
      toast.success("הזמנה התקבלה בהצלחה ");
      return results;
    } catch (error) {
      console.error("Error addNewOrder:", error);
      return null;
    }
  }
);

export const getAllOrdersSalesDetailsAPI = createAsyncThunk<
  ProductsList[] | null,
  void
>("getAllOrdersSalesDetailsAPI", async () => {
  try {
    const response = await axios.get("/api/orders/get-all-orders-sales-details");
    const { ok, results } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials getAllOrdersSalesDetailsAPI()");
    }

    return results as ProductsList[];
  } catch (error) {
    console.error(error);
    return null;
  }
});
