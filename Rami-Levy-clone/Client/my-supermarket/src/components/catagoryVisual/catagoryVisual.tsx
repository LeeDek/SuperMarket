import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { getAllProductsApi } from "../../features/products/productsAPI";
import { productsSelector } from "../../features/products/productsSlice";
import { Product } from "../../rami-types";
import Layout from "../Layout/Layout";
import ProductCard from "../ProductCard/ProductCard";
import "./catagoryVisual.scss";

const CategoryVisual = () => {
  const allProducts = useAppSelector(productsSelector);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  if (!id) {
    return null;
  }
  // make it number
  const selectedSubCategoryId = parseInt(id);

  // Fetch products by category ID
  useEffect(() => {
    if (!allProducts) {
      dispatch(getAllProductsApi());
    }
  }, []);

  // Filter products based on selectedSubCategoryId
  useEffect(() => {
    if (allProducts) {
      const filtered = allProducts.filter(
        (product) => product.sub_food_category_id === selectedSubCategoryId
      );
      setFilteredProducts(filtered);
    }
  }, [allProducts,selectedSubCategoryId]);

  return (
    <div className="category-visual-container">
      {filteredProducts.length > 0 && (
        <h1 className="product-sub-category">
          {filteredProducts[0].sub_food_category_name}
        </h1>
      )}
      {filteredProducts.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

export default CategoryVisual;
