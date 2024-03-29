import { createAsyncThunk } from "@reduxjs/toolkit";
import { Address, User } from "../../rami-types";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface GetUserApiArgs {
  email: string;
  password: string;
}
export const logInUserApi = createAsyncThunk<User | null, GetUserApiArgs>(
  "get-user",
  async (arg) => {
    try {
      const response = await axios.post("/api/users/login", arg);
      const { ok, user } = response.data;
      if (!ok) {
        throw new Error("פרטים לא נכונים");
      }
      return user;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);
export const getUserByIdApi = createAsyncThunk<User | null, number | null>(
  "get-user-by-id",
  async (user_id) => {
    try {
      const response = await axios.get(`/api/users/${user_id}`);
      const { ok, user } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getUserByIdApi()");
      }
      return user;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);
export const updateUserPasswordApi = createAsyncThunk<
  User | null,
  { user_id: number; old_password: string; new_password: string }
>("update-user-password", async (args) => {
  try {
    const response = await axios.patch(
      "/api/users/update-personal-password",
      args
    );
    const { ok, user } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials updateUserPasswordApi()");
    }
    toast.success("סתמו הסיסמה עודכנה בהצלחה");
    return user;
  } catch (error) {
    console.error(error); // this is temporary
    return null;
  }
});
export const logOutUserApi = createAsyncThunk("delete-token", async () => {
  try {
    const response = await axios.delete("/api/users/delete-token");
    const { ok } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials deleteTokenApi()");
    }
    return null;
  } catch (error) {
    console.error(error); // this is temporary
    return null;
  }
});
export const getUserFromTokenApi = createAsyncThunk<User | null>(
  "get-user-from-token",
  async () => {
    try {
      const response = await axios.get("/api/users/user-from-token");
      const { ok, user } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getUserFromTokenApi()");
      }
      return user;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);
interface AddNewUserAddresseArgs {
  user_id: number;
  is_default: boolean;
  city_id: number;
  street_id: number;
  floor: number;
  apartment: number;
  zip_code: number;
  phone_number: string;
  address_name: string;
}
export const addNewUserAddressApi = createAsyncThunk<
  Address[] | AddNewUserAddresseArgs,
  Address
>("add-new-user-address", async (args) => {
  try {
    if  (!args.user_id || !args.city_id || !args.street_id || !args.floor || !args.apartment || !args.zip_code || !args.phone_number || !args.address_name) {
      toast.error("אחד או יותר מהשדות ריקים, נסה שוב");
      throw new Error("Invalid credentials addNewUserAddressApi()");
    }
    const response = await axios.post("/api/addresses/add-new-address", args);
    const { ok, selectresult,error } = response.data;
    if (!ok) {
      toast.error(`הכתובת לא נוספה בהצלחה, נסה שוב ${error}`);

      throw new Error("Invalid credentials addNewUserAddressApi()");
    }
    return selectresult;
  } catch (error) {
    console.error(error); // this is temporary
    return null;
  }
});
export const getUserAddressesApi = createAsyncThunk<Address[] | null, number>(
  "get-user-addresses",
  async (user_id) => {
    try {
      const response = await axios.get(
        `/api/addresses/get-user-addresses/${user_id}`
      );
      const { ok, result } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getUserAddressesApi()");
      }
      return result;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);

export const deleteUserAddressApi = createAsyncThunk<
  void,
  { address_id: number; user_id: number }
>("delete-user-address", async ({ address_id, user_id }) => {
  try {
    const response = await axios.delete(
      `/api/addresses/delete-user-address/${user_id}/${address_id}`
    );
    const { ok } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials deleteUserAddressApi()");
    }
    toast.success("הכתובת נמחקה בהצלחה");
  } catch (error) {
    console.error(error); // this is temporary
  }
});

export const updateDefaultAddressApi = createAsyncThunk<
  void,
  { address_id: number; user_id: number }
>("update-default-address", async ({ address_id, user_id }) => {
  try {
    const response = await axios.put(
      `/api/addresses/update-default-address/${user_id}/${address_id}`
    );
    const { ok } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials updateDefaultAddressApi()");
    }
    toast.success("הכתובת נקבעה כברירת מחדל בהצלחה");
  } catch (error) {
    console.error(error); // this is temporary
  }
});
