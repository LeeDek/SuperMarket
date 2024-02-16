import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { get_SUB_FoodCategoriesApi } from "../../features/categories/categoriesAPI";
import { subFoodCategoriesSelector } from "../../features/categories/categoriesSlice";
import SubCategoryItem from "../SubCatagoryItem/SubCatagoryItem";
import "./subCatagoryManu.scss";

interface SubCategoryMenuProps {
  navbar_item_id: number;
}

const SubCategoryMenu: React.FC<SubCategoryMenuProps> = ({
  navbar_item_id,
}) => {
  const dispatch = useAppDispatch();
  const subFoodCategories = useAppSelector(subFoodCategoriesSelector);

  useEffect(() => {
    if (!subFoodCategories || subFoodCategories.length === 0) {
      dispatch(get_SUB_FoodCategoriesApi());
    }
  }, []);

  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const handleCategoryExpand = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(
        expandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const isCategoryExpanded = (categoryId: number) =>
    expandedCategories.includes(categoryId);

  const filteredCategories =
    subFoodCategories?.filter(
      (item) => item.navbar_item_id === navbar_item_id
    ) || [];

  const categoriesMap = filteredCategories.reduce((map, category) => {
    if (!map.has(category.food_category_id)) {
      map.set(category.food_category_id, {
        categoryName: category.food_category_name,
        subcategories: [],
      });
    }
    map.get(category.food_category_id)?.subcategories.push(category);
    return map;
  }, new Map<number, { categoryName: string; subcategories: typeof filteredCategories }>());

  return (
    <div className="sub-category-menu">
      {Array.from(categoriesMap.entries()).map(
        ([categoryId, categoryData], index) => (
          <div key={index} className="category-container">
            <div className="sub-cat-container">
              <div className="sub-cat-name">{categoryData.categoryName}</div>
              <ul className="sub-cat-items">
                {categoryData.subcategories
                  .slice(0, 7)
                  .map((item, subIndex) => (
                    <li key={subIndex} className="sub-category-item">
                      <SubCategoryItem item={item} />
                    </li>
                  ))}
              </ul>
              {categoryData.subcategories.length > 7 && (
                <div
                  className="sub-cat-chevron"
                  onClick={() => handleCategoryExpand(categoryId)}
                >
                  <span className="chevron-icon">
                    {isCategoryExpanded(categoryId) ? "▲" : "▼"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SubCategoryMenu;
