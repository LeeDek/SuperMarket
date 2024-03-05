import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./shopping-cart-bar.scss";

interface Props {
  totalPrice: number;
  isOpen: boolean;
  toggleCart: () => void; // Function to toggle the cart
  sendOrder: () => void; // Function to send the order
}


const ShoppingCartBar: React.FC<Props> = ({
  totalPrice,
  isOpen,
  toggleCart,
  sendOrder,
}) => {
  return (
    <div
      className={`shopping-cart-bar text-white d-flex justify-content-between align-items-center p-2 ${
        isOpen ? "open" : "closed"
      }`}
    >
      <div className="d-flex align-items-center">
        <button className="toggle-cart-button" onClick={toggleCart}>
          <FontAwesomeIcon
            icon={isOpen ? faChevronDown : faChevronUp}
            className={`mr-2 ${isOpen ? "rotate" : ""}`}
          />
        </button>
        <button className="toggle-text" onClick={sendOrder}>לתשלום</button>
      </div>
      <div>
        <span className="total-price-bar">{totalPrice}</span>{" "}
        <span className="shekel-bar">₪</span>
      </div>
    </div>
  );
};

export default ShoppingCartBar;
