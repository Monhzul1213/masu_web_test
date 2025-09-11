import React, { useState, useEffect, useRef } from "react";
import "../../css/qr.css";
import minusIcon from "../../assets/masu_icons/minus.png";
import plusIcon from "../../assets/masu_icons/plus.png";
import trashIcon from "../../assets/masu_icons/remove.png";
import { useTranslation } from "react-i18next";
import noImage from "../../assets/masu_icons/no-image.png";
import OrderTypeModal from "./OrderTypeModal";
 
export function Cart({ cart, setCart, onClose, onProceedToPayment }) {
  const didTriggerEmptyAction = useRef(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const { t } = useTranslation();
  const [showOrderType, setShowOrderType] = useState(false);
 
  useEffect(() => {
    if (cart.length === 0 && !didTriggerEmptyAction.current) {
      didTriggerEmptyAction.current = true;
      onClose();
    }
  }, [cart, onClose]);
 
  const getImageUrl = (item) => {
    if (!item?.image) return noImage;
    let url = item.image.replace(/^C:\\MasuFiles\\?/, "https://app.masu.mn:8082/");
    url = url.replace(/\\/g, "/");
    return url || noImage;
  };
 
  const incrementQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.invtId === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };
 
  const decrementQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.invtId === id) {
            if (item.qty === 1) return null;
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter(Boolean)
    );
  };
 
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.invtId !== id));
  };
 
  const handleOrder = () => {
    if (cart.length === 0) {
      alert(t("cart.empty") || "Сагс хоосон байна!");
      return;
    }
    setShowOrderType(true);
  };
 
  const handleOrderTypeSelect = (customerInfo) => {
    setShowOrderType(false);
    onProceedToPayment({
      amount: Number(total),
      customerInfo,
    });
  };
 
  return (
    <>
      {showOrderType && (
        <OrderTypeModal
          onSelect={handleOrderTypeSelect}
          onClose={() => setShowOrderType(false)}
        />
      )}
 
      <div className="cart_page">
        <div className="cart_header">
          <h2>{t("cart.your_cart")}</h2>
          <button className="add_item_btn" onClick={onClose}>
            + {t("cart.add_item")}
          </button>
        </div>
 
        <div className="cart_items">
          {cart.map((item, i) => (
            <div className="cart_item" key={i}>
              <img
                src={getImageUrl(item)}
                alt={item.name}
                className="cart_item_img"
              />
              <div className="cart_item_info">
                <p className="cart_item_name">{item.name}</p>
                <p className="cart_item_price">
                  {item.price.toLocaleString()}₮
                </p>
              </div>
 
              <div className="cart_item_controls">
                <button
                  className="qty_btn"
                  onClick={() => decrementQty(item.invtId)}
                >
                  <img src={minusIcon} alt="-" />
                </button>
                <span className="qty_value">{item.qty}</span>
                <button
                  className="qty_btn"
                  onClick={() => incrementQty(item.invtId)}
                >
                  <img src={plusIcon} alt="+" />
                </button>
                <button
                  className="remove_btn"
                  onClick={() => removeItem(item.invtId)}
                >
                  <img src={trashIcon} alt="Remove" />
                </button>
              </div>
            </div>
          ))}
        </div>
 
        <div className="cart_footer_bar" onClick={handleOrder}>
          <div className="cart_footer_total">{total.toLocaleString()}₮</div>
          <button className="cart_footer_btn">{t("cart.order")}</button>
        </div>
      </div>
    </>
  );
}