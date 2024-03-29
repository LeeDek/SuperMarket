import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./shopping-cart-bar.scss";
import { setIsToPayPressedTrue } from "../../features/cart/cartSlice";
import { useAppDispatch } from "../../app/hook";
import { useNavigate } from "react-router-dom";
import CartToatlPrice from "../CartToatlPrice/CartToatlPrice";

interface Props {
  isOpen: boolean;
  toggleCart: () => void;
  sendOrder?: () => void;
  isToPayPressed: boolean;
}

const ShoppingCartBar: React.FC<Props> = ({
  isOpen,
  toggleCart,
  sendOrder,
  isToPayPressed,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toPayPressed = async () => {
    try {
      await dispatch(setIsToPayPressedTrue());
      navigate("/check_out_offers");
    } catch (error) {
      console.error("Error sending order", error);
    }
   
  };

  return (
    <div
      className={`shopping-cart-bar text-white d-flex justify-content-between align-items-center p-2 ${
        isOpen ? "open" : "closed"
      } ${isToPayPressed ? "to-pay-pressed" : ""}`}
    >
      {!isToPayPressed && (
        <>
          <div className="d-flex align-items-center">
            <button className="toggle-cart-button" onClick={toggleCart}>
              <FontAwesomeIcon
                icon={isOpen ? faChevronDown : faChevronUp}
                className={`mr-2 ${isOpen ? "rotate" : ""}`}
              />
            </button>

            <button className={`toggle-pay-text `} onClick={toPayPressed}>
              לתשלום
            </button>
          </div>
          <div>
            <span className="total-price-bar">
              <CartToatlPrice />
            </span>{" "}
            {/* <span className="shekel-bar">₪</span> */}
          </div>
        </>
      )}

      {isToPayPressed && (
        <button className={`toggle-pay-text `} onClick={sendOrder}>
          תשלום
        </button>
      )}
    </div>
  );
};

export default ShoppingCartBar;
