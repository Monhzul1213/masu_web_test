import React, { useState, useEffect } from "react";
import "../../css/qr.css";
import minusIcon from "../../assets/masu_icons/minus.png";
import plusIcon from "../../assets/masu_icons/plus.png";
import trashIcon from "../../assets/masu_icons/remove.png";
import { useTranslation } from "react-i18next";
import noImage from '../../assets/masu_icons/no-image.png';

export function Cart({ cart, setCart, onClose, merchantId, siteId }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [orderRefNo, setOrderRefNo] = useState(null);
  const { t, i18n } = useTranslation();
  const fixedToken = '20250722141616000AAAzaqbddsxSKJJCVd1';
  const [imageCache, setImageCache] = useState({});

  useEffect(() => {
  if (cart.length === 0 && orderRefNo === null) {
    onClose(); 
  }
}, [cart, orderRefNo, onClose]);

  useEffect(() => {
    cart.forEach(async (item) => {
      if (!item.image || imageCache[item.invtId]) return;

      try {
        const encodedPath = encodeURIComponent(item.image);
        const res = await fetch(
          `https://app.masu.mn:8082/Integration/DownloadFile?filepath=${encodedPath}`,
          {
            headers: { authorization: fixedToken },
          }
        );

        if (!res.ok) throw new Error("Image fetch failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        setImageCache((prev) => ({ ...prev, [item.invtId]: url }));
      } catch (err) {
        console.error("Image load error", err);
      }
    });
  }, [cart]);

  const getImageUrl = (item) => {
    return imageCache[item.invtId] || noImage;
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

  const handleOrder = async () => {
    try {
      const payload = {
        merchantID: parseInt(merchantId),
        siteID: parseInt(siteId),
        totalAmount: total,
        totalSalesAmount: total,
        ticketSelID: 0,
        ticketDescr: "QR Order",
        salesitemholds: cart.map((item, idx) => ({
          lineNbr: idx + 1,
          invtID: item.invtId,
          qty: item.qty,
          price: item.price,
          amount: item.price * item.qty,
          serviceDescr: item.name,
        })),
      };

      const response = await fetch(
        `https://app.masu.mn:8082/Integration/AddSalesHold`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "20250722141616000AAAzaqbddsxSKJJCVd1",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || result.rettype === 8) {
        alert(result.retdesc || "Захиалга хадгалах үед алдаа гарлаа.");
        return;
      }

      if (result.rettype === 0) {
        setOrderRefNo(result.retdata.refNo);
        setTimeout(() => setCart([]), 0);
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Захиалга илгээхэд алдаа гарлаа.");
    }
  };

  if (orderRefNo) {
  return (
    <div
      className="order_success"
      onClick={onClose}
      style={{ cursor: "pointer" }}
    >
      <p className="order_text">{t('cart.order_number')}</p>
      <div className="order_box">{orderRefNo}</div>
      <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
        {t('cart.tap_to_go_back')}
      </p>
    </div>
  );
}

  return (
    <div className="cart_page">
      <div className="cart_header">
        <h2>{t('cart.your_cart')}</h2>
        <button className="add_item_btn" onClick={onClose}>
        + {t('cart.add_item')}
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
              <p className="cart_item_price">{item.price.toLocaleString()}₮</p>
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
        <div className="cart_footer_total">
          {total.toLocaleString()}₮
        </div>
        <button className="cart_footer_btn">{t('cart.order')}
        </button>
      </div>
    </div>
  );
}
