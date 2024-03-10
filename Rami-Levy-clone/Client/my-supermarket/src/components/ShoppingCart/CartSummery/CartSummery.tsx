import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { loggedInUserSelector } from "../../../features/logged_in_user/loggedInUserSlice";
import { Address, Delivery, Order } from "../../../rami-types";
import "./cartSummery.scss";
import {
  getUserAddressesApi,
  getUserFromTokenApi,
} from "../../../features/logged_in_user/loggedInUserAPI";
import { Modal } from "react-bootstrap";
import ChengeContactModal from "./Modals/ChengeContactModal";
import ChengeAddressModal from "./Modals/ChengeAddressModal";
import AvailableDeliveriesModal from "./Modals/AvailableDeliveriesModal";

interface CartSummeryProps {
    orderContact: {
        full_name: string;
        phone_number: string;
    };
    setOrderContact: (contact: { full_name: string; phone_number: string }) => void;
    selectedAddress: Address | null;
    setSelectedAddress: (address: Address | null) => void;
    selectedDelivery: Delivery | null;
    setSelectedDelivery: (delivery: Delivery | null) => void;
    selectedHowToReceive: string;
    setSelectedHowToReceive: (howToReceive: string) => void;
    selectedAlternativeProducts: string;
    setSelectedAlternativeProducts: (alternativeProducts: string) => void;
    setNewOrder: (field: string, value: string | number) => void;
   
}   

const CartSummery : React.FC<CartSummeryProps> = ({
    orderContact,
    setOrderContact,
    selectedAddress,
    setSelectedAddress,
    selectedDelivery,
    setSelectedDelivery,
    selectedHowToReceive,
    setSelectedHowToReceive,
    selectedAlternativeProducts,
    setSelectedAlternativeProducts,
    setNewOrder
}) => {
  const loggedInUser = useAppSelector(loggedInUserSelector);
  const [showModal, setShowModal] = useState({
    changeContact: false,
    changeAddress: false,
    changeDelivery: false,
    showProducts: false,
  });
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loggedInUser) {
      getUserToken();
    } else {

      setOrderContact({
        full_name: loggedInUser.first_name + " " + loggedInUser.last_name,
        phone_number: loggedInUser.phone_number,
      });
      // Select the default address if available
      if (loggedInUser.addresses) {
        const defaultAddress = loggedInUser.addresses.find(
          (address) => address.is_default
        );
        setSelectedAddress(defaultAddress || null);
        
      }
    }
  }, [loggedInUser]);

  const getUserToken = async () => {
    const response = await dispatch(getUserFromTokenApi());
    if (response.payload) {
      dispatch(getUserAddressesApi(response.payload.user_id));
    }
  };

  const toggleModal = (modalType) => {
    setShowModal({ ...showModal, [modalType]: !showModal[modalType] });
  };

  return (
    <div className="cart-summery-content">
      {orderContact && (
        <>
          <div className="row align-items-center">
            <div className="col">
              <p>{orderContact.full_name}</p>
            </div>
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={() => toggleModal("changeContact")}
              >
                שינוי
              </button>
            </div>
          </div>
          {selectedAddress ? (
            <div className="row align-items-center">
              <div className="col">
                <p>
                  {selectedAddress.street_name} {selectedAddress.house_number} ,{" "}
                  {selectedAddress.city_name}
                </p>
                <p>דירה {selectedAddress.apartment} </p>
                <p>קומה {selectedAddress.floor} </p>
              </div>
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={() => toggleModal("changeAddress")}
                >
                  שינוי
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>בחר כתובת למשלוח</p>
              <button
                className="btn btn-primary"
                onClick={() => toggleModal("changeAddress")}
              >
                שינוי
              </button>
            </div>
          )}
          <div className="row align-items-center">
            <div className="col">
                {selectedDelivery ? (
                    <p>
                        {selectedDelivery.delivery_finish_date}{" "}
                        {selectedDelivery.delivery_start_time}
                    </p>
                ) : (
                    <p>בחר מועד משלוח</p>
                )}
                        </div>
            <div className="col">
              <button onClick={() => toggleModal("changeAddress")} className="btn btn-primary">שינוי</button>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col">
              <p>מודאל להצגת המוצרים של העגלה </p>
            </div>
            <div className="col">
              <button className="btn btn-primary">שינוי</button>
            </div>
          </div>
          <Modal
            show={showModal.changeContact}
            onHide={() => toggleModal("changeContact")}
            dialogClassName="custom-modal"
          >
            <Modal.Body>
              <ChengeContactModal
                onClose={() => toggleModal("changeContact")}
                orderContact={orderContact}
                setOrderContact={setOrderContact}
                selectedHowToReceive={selectedHowToReceive}
                setSelectedHowToReceive={setSelectedHowToReceive}
                selectedAlternativeProducts={selectedAlternativeProducts}
                setSelectedAlternativeProducts={setSelectedAlternativeProducts}
              />
            </Modal.Body>
          </Modal>
          <Modal
            show={showModal.changeAddress}
            onHide={() => toggleModal("changeAddress")}
            dialogClassName="two-in-one-modal"
           
          >
            <Modal.Body className="two-in-one-modal-body">
              <div className="address-section">
                <ChengeAddressModal
                  setSelectedAddress={setSelectedAddress}
                  selectedAddress={selectedAddress}
                  setNewOrder={setNewOrder}
                  onClose={() => toggleModal("changeAddress")}
                />
              </div>
              <div className="deliveries-section">
                <AvailableDeliveriesModal
                setSelectedDelivery={setSelectedDelivery}
                selectedDelivery={selectedDelivery}
                setNewOrder={setNewOrder}
                onClose={() => toggleModal("changeAddress")}
                />
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default CartSummery;
