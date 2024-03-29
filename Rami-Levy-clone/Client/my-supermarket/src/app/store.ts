import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice'; // Adjust the path based on your project structure
import loggesInUserReducer from "../features/logged_in_user/loggedInUserSlice";
import citiesReducer from "../features/cities/citiesSlice";
import streetsReducer from "../features/streets/streetsSlice";
import allUsersReducer from "../features/all_users_admin/allUsersSlice";
import categoriesReducer from "../features/categories/categoriesSlice"
import productsReducer from "../features/products/productsSlice"
import navbarReducer from "../features/navbar_items/navbarItemsSlice"
import roleRducer from "../features/roles/rolesSlice"
import ordersReducer from "../features/orders/ordersSlice";
import salesReducer from "../features/sales/salesSlice";
import deliveriesReducer from "../features/deliveries/allDeliveriesSlice";

export const store = configureStore({
  reducer: {
    loggedInUser: loggesInUserReducer,
    allUsers: allUsersReducer,
    cities: citiesReducer,
    streets: streetsReducer,
    categories: categoriesReducer,
    products: productsReducer,
    navbarItems: navbarReducer,
    roles: roleRducer,
    orders: ordersReducer,
    cart: cartReducer, // Include the cart reducer here
    sales: salesReducer,
    deliveries: deliveriesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;