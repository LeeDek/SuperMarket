import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import Logo from "../../assets/logos/rami-levy-online.png";
import {
  activeCartSelector,
  isOpenCartSelector,
  isToPayPressedSelector,
  setIsOpenCart,
} from "../../features/cart/cartSlice";
import { productsSelector } from "../../features/products/productsSlice";
import {
  Address,
  Delivery,
  Order,
  Product,
  ProductsList,
  Sales,
} from "../../rami-types";
import ShoppingCartBar from "../ShoppingCartBar/ShoppingCartBar";
import "./shopping-cart.scss";
import { getAllProductsApi } from "../../features/products/productsAPI";
import CartSummery from "./CartSummery/CartSummery";
import { selectSales } from "../../features/sales/salesSlice";
import { getSalesAPI } from "../../features/sales/salesAPI";
import { loggedInUserSelector } from "../../features/logged_in_user/loggedInUserSlice";
import { updateDeliveryStatusApi } from "../../features/api/deliveriesAPI";
import { addNewUserContactAPI } from "../../features/api/usersContactsAPI";
import BeforePayModal from "./CartSummery/Modals/BeforePayModal";
import { Modal } from "react-bootstrap";
import { addNewOrderAPI } from "../../features/orders/ordersAPI";
import {
  getUserAddressesApi,
  getUserFromTokenApi,
} from "../../features/logged_in_user/loggedInUserAPI";
import { debug } from "console";
import { sale } from "../../assets/icons/active";

const ShoppingCart: React.FC = () => {
  const activeCart = useAppSelector(activeCartSelector);
  const isOpenCart: boolean = useAppSelector(isOpenCartSelector);
  const loggedInUser = useAppSelector(loggedInUserSelector);
  const isToPayPressed: boolean = useAppSelector(isToPayPressedSelector);
  const allProducts = useAppSelector(productsSelector);
  const [totalPrice, setTotalPrice] = useState(0);
  const allSales = useAppSelector<Sales[]>(selectSales);
  const [orderContact, setOrderContact] = useState({
    full_name: loggedInUser?.first_name + " " + loggedInUser?.last_name || "",
    phone_number: loggedInUser?.phone_number || "",
  });
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );

  const initialOrder: Order = {
    order_id: null,
    cart_id: null,
    user_id: null,
    user_contact_id: null,
    delivery_id: null,
    order_creation_date: Date.now().toString(),
    status: 1,
    alternative_products: "צרו קשר לתיאום",
    how_receive_shipment: "יש מישהו בבית",
  };
  const [newOrder, setNewOrder] = useState<Order>(initialOrder);
  const [showBeforePayModal, setShowBeforePayModal] = useState(false);

  const hanelsetNewOrder = (field: string, value: string | number) => {
    setNewOrder({ ...newOrder, [field]: value });
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!allProducts) {
      dispatch(getAllProductsApi());
    }
    if (allSales.length === 0) {
      dispatch(getSalesAPI());
    }
  }, []);

  useEffect(() => {
    if (activeCart) {
      if (activeCart.cartList) {
        setTotalPrice(calculateTotalPrice(activeCart.cartList));
        debugger;
        hanelsetNewOrder("cart_id", activeCart.cart_id);
      } else {
        setTotalPrice(0);
      }
    }
  }, [activeCart]);

  useEffect(() => {
    if (!loggedInUser) {
      getUserToken();
    }
    if (loggedInUser && loggedInUser.user_id) {
      hanelsetNewOrder("user_id", loggedInUser.user_id);
    }
  }, [loggedInUser]);

  const getUserToken = async () => {
    const response = await dispatch(getUserFromTokenApi());
    if (response.payload) {
      dispatch(getUserAddressesApi((response.payload as any).user_id));
    }
  };
  const updateContactId = async () => {
    const insertId = await addNewUserContactAPI(
      orderContact.full_name,
      orderContact.phone_number
    );
    if (insertId) {
      hanelsetNewOrder("user_contact_id", insertId);
    }
  };
  useEffect(() => {
    if (orderContact.full_name && orderContact.phone_number) {
      debugger;
      updateContactId();
    }
  }, [orderContact]);
  const calculateTotalPrice = (cartList: ProductsList[]) => {
    let totalPrice = 0;
    cartList.forEach((cartItem: ProductsList) => {
      const discount = allSales.find(
        (sale) => sale.product_id === cartItem.product_id
      );
      if (discount) {
        totalPrice += discount.sale_price * cartItem.product_amount;
      } else totalPrice += cartItem.product_price * cartItem.product_amount;
    });
    return totalPrice;
  };

  const formatPrice = (price: number) => {
    debugger;
    const [main, decimal] = price.toFixed(2).split(".");
    return (
      <span>
        <span className="main-price">{main}.</span>
        <sup className="decimal-price">{decimal}</sup>
      </span>
    );
  };

  const checkDiscount = (product: Product | null): number => {
    debugger;
    if (product) {
      if (allSales.length > 0 && product.product_price) {
        const sale = allSales.find((s) => s.product_id === product.product_id);
        if (sale) {
          return sale.sale_price;
        }
        else {
          
          return product.product_price;
        }
      }
      if (product.product_price) {
        
        return product?.product_price;
      }
    }
      return 0
  };

  const toggleCart = () => {
    dispatch(setIsOpenCart());
  };

  const sendOrder = async () => {
    if (!selectedDelivery) {
      alert("יש לבחור אזור משלוח");
      return;
    }
    if (!orderContact.full_name || !orderContact.phone_number) {
      alert("יש למלא פרטי קשר");
      return;
    }
    // update delivery status

    if (selectedDelivery) {
      await updateDeliveryStatusApi(selectedDelivery.delivery_id);
    }
    // add user_contact_id to database and get the id

    debugger;
    if (
      newOrder.user_contact_id &&
      newOrder.delivery_id &&
      newOrder.cart_id &&
      newOrder.user_id
    ) {
      setShowBeforePayModal(true);
    }
  };

  const addNewUserOrder = async () => {
    if (
      newOrder.user_contact_id &&
      newOrder.delivery_id &&
      newOrder.cart_id &&
      newOrder.user_id
    ) {
      const response = await dispatch(addNewOrderAPI(newOrder));
    }
  };

  const convertToBase64 = (imageString: string) => {
    return btoa(String.fromCharCode(...new Uint8Array(imageString)));
  };

  return (
    <div className={`shopping-cart`}>
      <img className="rami-online-cart" src={Logo} alt="Rami Levy Online" />
      {!isToPayPressed && (
        <ul className="cart-content">
          {activeCart &&
            activeCart.cartList &&
            activeCart.cartList.map((cartProduct) => {
              // Find the product corresponding to the cart product
              if (allProducts) {
                const product = allProducts.find(
                  (product) => product.product_id === cartProduct.product_id
                );
                if (product) {
                  return (
                    <li className="cart-item" key={cartProduct.cart_id}>
                      <div className="product-details-cart">
                        <img
                          src={`data:image/jpeg;base64,${convertToBase64(
                            product.product_img_data_a.data
                          )}`}
                          alt={product.product_name}
                        />
                        <h5 className="prod-name-cart">
                          {product.product_name}
                        </h5>
                        {/* Render SVG image */}

                        <p className="cart-items-price">
                          {" "}
                          {product &&
                          product.product_price &&
                          cartProduct.product_amount
                            ? formatPrice(
                                checkDiscount(product) *
                                  cartProduct.product_amount
                              )
                            : null}{" "}
                          ₪
                        </p>
                      </div>
                    </li>
                  );
                }
                return null; // Skip rendering if product is not found
              }
            })}
        </ul>
      )}
      {isToPayPressed && (
        <ul className="cart-content">
          {isToPayPressed && (
            <ul className="cart-content">
              <CartSummery
                orderContact={orderContact}
                setOrderContact={setOrderContact}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                selectedDelivery={selectedDelivery}
                setSelectedDelivery={setSelectedDelivery}
                setNewOrder={hanelsetNewOrder}
                newOrder={newOrder}
              />
            </ul>
          )}
          <Modal
            show={showBeforePayModal}
            onHide={() => setShowBeforePayModal(false)}
            dialogClassName="custom-modal"
          >
            <Modal.Body>
              <BeforePayModal
                onCancle={() => setShowBeforePayModal(false)}
                onPay={addNewUserOrder}
              />
            </Modal.Body>
          </Modal>
        </ul>
      )}
      <ShoppingCartBar
        totalPrice={totalPrice}
        isOpen={isOpenCart}
        toggleCart={toggleCart}
        sendOrder={sendOrder}
        isToPayPressed={isToPayPressed}
      />
    </div>
  );
};

export default ShoppingCart;
