import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const addNewFoodCategoryApi = async (food_category_name: string) => {
  try {
    const response = await axios.post("/api/categories/add-new-food-category", {
      food_category_name,
    });
    const { ok, results } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials addNewProductInventories()");
    }
    toast.success("קטגוריה נוספה בהצלחה");

    return results.insertId;
  } catch (error) {
    console.error("Error addNewProductInventories:", error);
    throw error;
  }
};

export const addNewSubFoodCategoryApi = async (
  sub_category_name: string,
  food_category_id: number,
  navbar_item_id: number
) => {
  try {
    const response = await axios.post(
      "/api/categories/add-new-sub-food-category",
      { sub_category_name, food_category_id, navbar_item_id }
    );
    const { ok, results } = response.data;
    if (!ok) {
      throw new Error("Invalid credentials addNewProductInventories()");
    }
    toast.success("תת קטגוריה נוספה בהצלחה");

    return results.insertId;
  } catch (error) {
    console.error("Error addNewProductInventories:", error);
    throw error;
  }
};
