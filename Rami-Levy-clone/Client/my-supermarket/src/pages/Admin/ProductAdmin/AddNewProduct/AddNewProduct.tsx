import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import {
  getFoodCategoriesApi,
  get_SUB_FoodCategoriesApi,
} from "../../../../features/categories/categoriesAPI";
import {
  foodCategoriesSelector,
  subFoodCategoriesSelector,
} from "../../../../features/categories/categoriesSlice";
import {
  FoodCategories,
  Product,
  SubFoodCategories,
} from "../../../../rami-types";
import {
  addNewProductDetailes,
  addNewProductInventory,
  saveProductImages,
} from "../../../../features/api/productsAPI";
import { useNavigate } from "react-router";
import "./AddNewProduct.scss";

import RamiBtn from "./../../../../components/RamiBtn/RamiBtn";
import { productsSelector } from "../../../../features/products/productsSlice";
import { getAllProductsApi } from "../../../../features/products/productsAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddNewProductProps {
  onClose: () => void;
}

const AddNewProduct: React.FC<AddNewProductProps> = ({ onClose }) => {
  const allProducts = useAppSelector(productsSelector);
  useEffect(() => {
    if (!allProducts) {
      dispatch(getAllProductsApi());
    }
  }, []);

  const nameValidation = (name: string) => {
    const productName = allProducts?.find(
      (product) => product.product_name === name
    );
    if (productName !== undefined) {
      return true;
    }
    return false;
  };

  const initialProduct: Product = {
    product_id: null,
    sub_food_category_id: null,
    product_image_id: null,
    product_img_name_a: "",
    product_img_name_b: "",
    product_img_data_a: "",
    product_img_data_b: "",
    product_inventory: null,
    sub_food_category_name: "",
    food_category_id: null,
    food_category_name: "",
    navbar_item_id: null,
    navbar_item_name: "",
    product_price: null,
    product_name: "",
    product_description: "",
    export_country: "",
    brand: "",
    content: "",
    allergy_info: "",
    type: "",
    israel_milk: "",
    cosher: "",
    product_components: "",
    serving_suggestion: "",
    units_stock: null,
  };

  const [imagesProductFiles, setImagesProductFiles] = useState<File[]>();
  const [add, setAdd] = useState<number>(0);
  const [newProduct, setNewProduct] = useState(initialProduct);
  const foodCategories = useAppSelector(foodCategoriesSelector);
  const subFoodCategories = useAppSelector(subFoodCategoriesSelector);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imgsValidation, setImgsValidation] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFoodCategoriesApi());
    dispatch(get_SUB_FoodCategoriesApi());
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "product_price") {
      const price = parseFloat(value);
      if (price < 0) {
        return toast.warning("המחיר חייב להיות מספר חיובי");
      }
      setNewProduct({ ...newProduct, [name]: price });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };
  const handleReset = () => {
    setNewProduct(initialProduct);
    setUploadedImages([]);
    setImagesProductFiles([]);
    setAdd(0);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImagesProductFiles(files ? Array.from(files) : []);
    // Check if number of selected files exceeds 2
    if (files && files.length > 2) {
      setImgsValidation(true);
    } else {
      setImgsValidation(false);
    }

    // Display uploaded images
    if (files && files.length > 0) {
      const fileUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages(fileUrls);
    }
  };

  const handelAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (imgsValidation) {
        toast.warning("אנא בחר עד 2 תמונות");
        return;
      }
      if (nameValidation(newProduct.product_name)) {
        toast.error("שם קיים במערכת, אנא בחר שם חדש");
        return;
      }
      const insertProductId = await addNewProductDetailes(newProduct);
      if (!insertProductId) {
        throw new Error("Error adding new product , no product id returned");
      }
      await addNewProductInventory(insertProductId, add);
      // need to save images to server
      if (imagesProductFiles && imagesProductFiles.length > 0) {
        await saveProductImages(insertProductId, imagesProductFiles);
      }

      toast.success("מוצר נוסף בהצלחה למאגר המוצרים");
    } catch (error) {
      console.error("Error adding new product on handelAddNewProduct", error);
    }
  };

  return (
    <div className="add-new-product-container">
      <h1 className="new-product-title">הוספת מוצר חדש</h1>
      <form className="new-prod-form" onSubmit={handelAddNewProduct}>
        <select
          id="food_category_id"
          name="food_category_id"
          value={newProduct.food_category_id || ""}
          onChange={handleInputChange}
          required
        >
          <option value="">בחר קטגוריה</option>
          {foodCategories &&
            foodCategories.map((category: FoodCategories) => (
              <option
                key={category.food_category_id}
                value={category.food_category_id}
              >
                {category.food_category_name}
              </option>
            ))}
        </select>

        {newProduct.food_category_id && subFoodCategories && (
          <>
            <label htmlFor="sub_food_category_id">קטגוריה משנית:</label>
            <select
              id="sub_food_category_id"
              name="sub_food_category_id"
              value={newProduct.sub_food_category_id || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">בחר קטגוריה משנית</option>
              {subFoodCategories
                .filter(
                  (subCategory: SubFoodCategories) =>
                    subCategory.food_category_id ===
                    (newProduct.food_category_id
                      ? +newProduct.food_category_id
                      : null)
                )
                .map((subCategory: SubFoodCategories) => (
                  <option
                    key={subCategory.sub_food_category_id}
                    value={subCategory.sub_food_category_id}
                  >
                    {subCategory.sub_food_category_name}
                  </option>
                ))}
            </select>
          </>
        )}

        <input
          type="text"
          id="product_name"
          name="product_name"
          placeholder="שם המוצר"
          value={newProduct.product_name}
          onChange={handleInputChange}
          required
        />

        {/* Product Description */}
        <textarea
          id="product_description"
          name="product_description"
          placeholder="תיאור המוצר"
          value={newProduct.product_description}
          onChange={handleInputChange}
          required
        ></textarea>

        {/* Product Price */}
        <input
          type="number"
          id="product_price"
          name="product_price"
          placeholder="מחיר מוצר"
          value={newProduct.product_price || ""}
          onChange={handleInputChange}
          required
        />

        {/* Export Country */}
        <input
          type="text"
          id="export_country"
          name="export_country"
          placeholder="מדינת ייצוא"
          value={newProduct.export_country}
          onChange={handleInputChange}
        />

        {/* Brand */}
        <input
          type="text"
          id="brand"
          name="brand"
          placeholder="מותג"
          value={newProduct.brand}
          onChange={handleInputChange}
        />

        {/* Content */}
        <input
          type="text"
          id="content"
          name="content"
          placeholder="תכולה"
          value={newProduct.content}
          onChange={handleInputChange}
        />

        {/* Allergy Information */}
        <input
          type="text"
          id="allergy_info"
          name="allergy_info"
          placeholder="מידע על אלרגנים"
          value={newProduct.allergy_info}
          onChange={handleInputChange}
        />
        {/* Product Components */}
        <input
          type="text"
          id="product_components"
          name="product_components"
          placeholder="רכיבי המוצר"
          value={newProduct.product_components}
          onChange={handleInputChange}
        />

        {/* Serving Suggestion */}

        <input
          type="text"
          id="serving_suggestion"
          name="serving_suggestion"
          placeholder="הצעת הגשה"
          value={newProduct.serving_suggestion}
          onChange={handleInputChange}
        />
        {/* Type */}

        <input
          type="text"
          id="type"
          name="type"
          placeholder="סוג מוצר"
          value={newProduct.type}
          onChange={handleInputChange}
        />

        {/* Israel Milk */}
        <input
          type="text"
          id="israel_milk"
          name="israel_milk"
          placeholder="חלב ישראלי"
          value={newProduct.israel_milk}
          onChange={handleInputChange}
        />

        {/* Kosher */}
        <input
          type="text"
          id="cosher"
          name="cosher"
          placeholder="כשרות"
          value={newProduct.cosher}
          onChange={handleInputChange}
        />
        <div>
          <label htmlFor="imagesProduct">תמונות המוצר:</label>
          <input
            type="file"
            id="imagesProduct"
            name="imagesProduct"
            multiple
            onChange={handleFileChange}
          />
        </div>
        {uploadedImages.length > 0 && (
          <div>
            <label>תמונות שהועלו:</label>
            {uploadedImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Image ${index}`}
                style={{ width: "100px", height: "100px", margin: "5px" }}
              />
            ))}
            {imgsValidation && <p>אנא בחר עד 2 תמונות</p>}
          </div>
        )}
        <div>
          <label htmlFor="imagesProduct">כמה במלאי ?</label>
          <input
            type="number"
            id="add"
            name="add"
            value={add}
            onChange={(e) => setAdd(+e.target.value)}
          />
        </div>
        <RamiBtn type="submit">שלח</RamiBtn>
        <RamiBtn onClick={handleReset}>נקה</RamiBtn>
        <RamiBtn onClick={onClose}>בטל</RamiBtn>
      </form>
    </div>
  );
};

export default AddNewProduct;
