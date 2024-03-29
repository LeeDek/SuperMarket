import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../rami-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const getAllUsersApi = createAsyncThunk<User[] | null, void>(
  "get-all-users",
  async () => {
    try {
      const response = await axios.get("/api/users");
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials getAllUsersApi()");
      }

      return results;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);
interface UserUpdateRole {
  user_id: number | null;
  role_id: number | null;
}
export const updateUserRoleApi = createAsyncThunk<
  User[] | null,
  UserUpdateRole
>("update-user-role", async (arg) => {
  try {
    const response = await axios.put("/api/users/update-user-role", arg);
    const { ok, results } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials updateUserRoleApi()");
    }

    return results;
  } catch (error) {
    console.error(error); // this is temporary
    return null;
  }
});

export const deleteUserApi = createAsyncThunk<User[] | null, number | null>(
  "delete-user",
  async (arg) => {
    try {
      const response = await axios.delete(`/api/users/${arg}`);
      const { ok, results } = response.data;
      if (!ok) {
        throw new Error("Invalid credentials deleteUserApi()");
      }
      toast.success("המוצר נמחק");
      return results;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);
interface UserUpdatePassword {
  user_id: number | null;
  password: string;

}
export const updatePasswordApi = createAsyncThunk<void, UserUpdatePassword
>("update-password", async (arg) => {
  try {
    const response = await axios.put("/api/users/update-password", arg);
    const { ok } = response.data;
   
    if (!ok) {
      throw new Error("Invalid credentials updatePasswordApi()");
    }
    toast.success("סיסמא עודכנה בהצלחה");
  } catch (error) {
    console.error(error); // this is temporary
   
  }
});
interface UserUpdateDetails {
  user_id: number | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  gender: string | null;
  birth_date: string | null;
}
export const updateUserDetailsApi = createAsyncThunk<any, UserUpdateDetails>(
  "update-user-details",
  async (arg) => {
    try {
      const response = await axios.put("/api/users/update-user-details", arg);
      const { ok, results } = response.data;

      if (!ok) {
        throw new Error("Invalid credentials updateUserDetailsApi()");
      }
      toast.success("User details updated successfully");
      return results;
    } catch (error) {
      console.error(error); // this is temporary
      return null;
    }
  }
);
