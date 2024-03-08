import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { Sales } from "../../rami-types";

export const getSalesAPI = createAsyncThunk<Sales[], void>(
  "getSalesAPI",
  async () => {
    try {
      console.log("getSalesAPI");
      const response = await axios.get("/api/sales");
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getSalesAPI()");
      }
      return results as Sales[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
);

export const addSaleAPI = createAsyncThunk<Sales, void>(
  "addSaleAPI",
  async (newSale) => {
    try {
      console.log("addSaleAPI", newSale);
      const response = await axios.post("/api/sales/add-new-sale", newSale);
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials addSaleAPI()");
      }
      return results as Sales;
    } catch (error) {
      console.error(error);
      return {} as Sales;
    }
  }
);

export const updateSaleAPI = createAsyncThunk<Sales, Sales>(
  "updateSaleAPI",
  async (sale) => {
    try {
      console.log("updateSaleAPI", sale);
      const response = await axios.put(`/api/sales/update-sale/${sale.sale_id}`, sale);
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials updateSaleAPI()");
      }
      return results as Sales;
    } catch (error) {
      console.error(error);
      return {} as Sales;
    }
  }
);

export const deleteSaleAPI = createAsyncThunk<Sales, string>(
  "deleteSaleAPI",
  async (sale_id) => {
    try {
      console.log("deleteSaleAPI", sale_id);
      const response = await axios.delete(`/api/sales/delete-sale/${sale_id}`);
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials deleteSaleAPI()");
      }
      return results as Sales;
    } catch (error) {
      console.error(error);
      return {} as Sales;
    }
  }
);
  