import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { getList } from "../../services";
import { decrypt } from "../../helpers/encrypt";
import cartIcon from "../../assets/i3.png";
import { Cart } from "./Cart";
import flagMn from "../../assets/flag_mn.png";
import flagEn from "../../assets/flag_en.png";
import flagKr from "../../assets/flag_kr.png";
import flagCn from "../../assets/flag_cn.png";
import flagGr from "../../assets/flag_gr.png";
import "../../css/qr.css";
import { Category } from "../../components/lone/qr/menu/Category";
import { ProductCard } from "../../components/lone/qr/menu/ProductCard";
import PaymentOptions from "./PaymentOptions";

export function QRMenu() {
  const [categories, setCategories] = useState([]);
  const [ticketBinId, setTicketBinId] = useState(null);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCartPage, setShowCartPage] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [paymentTypeId, setPaymentTypeId] = useState(null);
  const [siteMetaForPayment, setSiteMetaForPayment] = useState(null);

  const sliceSize = 50;
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const qrCodeParam = new URLSearchParams(window.location.search).get("qr");
  const loaderRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = [
    { code: "en", flag: flagEn, label: "English" },
    { code: "mn", flag: flagMn, label: "Монгол" },
    { code: "kr", flag: flagKr, label: "한국어" },
    { code: "cn", flag: flagCn, label: "中文" },
    { code: "gr", flag: flagGr, label: "Deutsch" },
  ];

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (!qrCodeParam) return;
    try {
      const decrypted = decrypt(decodeURIComponent(qrCodeParam));
      const parts = decrypted.split("-");
      const merchantId = parts[0]?.trim();
      const siteIdStr = parts[1]?.trim();
      const ticketBinIdStr = parts[2]?.trim();

      const parsedSiteId = parseInt(siteIdStr, 10);
      if (!Number.isNaN(parsedSiteId)) {
        setSiteId(parsedSiteId);
        setDecryptedData({ merchantId });
      }
      if (ticketBinIdStr) setTicketBinId(ticketBinIdStr);
    } catch (e) {
      console.error("❌ QR decode error:", e);
    }
  }, [qrCodeParam]);

  const fetchCategories = async () => {
    const res = await dispatch(getList(user, token, "Inventory/GetCategory", null));
    if (res?.data) {
      setCategories(res.data);
      setSelectedCategoryId(null);
    }
  };

  const fetchProducts = async () => {
    if (!decryptedData || !siteId) return;

    const fixedToken = "20250722141616000AAAzaqbddsxSKJJCVd1";
    const query = `Integration/GetQrMenuPub?MerchantID=${decryptedData.merchantId}&SiteID=${siteId}`;

    const res = await dispatch(
      getList(user, fixedToken, query, null, {
        authorization: fixedToken,
      })
    );

    if (res?.data?.inventory) {
      setProducts(res.data.inventory);
      setVisibleProducts(res.data.inventory.slice(0, sliceSize));
    }

    if (res?.data?.category) {
      setCategories(res.data.category);
      setSelectedCategoryId(null);
    }

    if (res?.data?.paymentTypeID != null) {
      setPaymentTypeId(Number(res.data.paymentTypeID));
    }

    const ptList = res?.data?.paymenttypes || [];
    const getId = (p) => Number(p.paymentTypeId ?? p.paymenttypeid ?? p.id);
    const getName = (p) => String(p.paymentTypeName ?? p.name ?? "").toLowerCase();
    const isDefault = (p) =>
      p.isDefault === true || p.isDefault === "Y" || p.default === true;
    const isActive = (p) =>
      p.isActive === true || p.active === true || (p.status ?? 1) === 1;

    const qpayCandidate = ptList.find((p) => {
      const name = getName(p);
      return name.includes("qpay") || name.includes("q pay");
    });
    const defaultCandidate = ptList.find((p) => isDefault(p));
    const firstActive = ptList.find((p) => isActive(p));
    const chosen = qpayCandidate || defaultCandidate || firstActive || ptList[0];
    const chosenId = getId(chosen);

    if (Number.isFinite(chosenId) && chosenId > 0) {
      setPaymentTypeId(chosenId);
    } else {
      setPaymentTypeId(null);
    }

    const sites = res?.data?.sites || [];
    const matched = sites.find((s) => Number(s.siteId) === Number(siteId));
    setSiteMetaForPayment(
      matched
        ? {
            bankCode: matched.bank ?? null,
            accountNumber: matched.bankAccount ?? null,
            accountName: matched.bankAccountName ?? null,
            useQrMenu: matched.useQrMenu ?? null,
          }
        : null
    );
  };

  const filteredCategories = useMemo(() => {
    const productCategoryIds = new Set(products.map((p) => p.categoryId));
    return categories.filter((cat) => productCategoryIds.has(cat.categoryId));
  }, [categories, products]);

  useEffect(() => {
    if (decryptedData && siteId) {
      setProducts([]);
      setVisibleProducts([]);
      fetchProducts();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedData, siteId]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [products]);

  const loadMore = () => {
    const start = visibleProducts.length;
    const end = start + sliceSize;
    if (start < products.length) {
      setVisibleProducts((prev) => [...prev, ...products.slice(start, end)]);
    }
  };

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter(
      (p) => p && (!selectedCategoryId || p.categoryId === selectedCategoryId)
    );
  }, [visibleProducts, selectedCategoryId]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.invtId === product.invtId);
      if (existing) {
        return prevCart.map((item) =>
          item.invtId === product.invtId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (invtId) => {
    setCart((prev) => prev.filter((item) => item.invtId !== invtId));
  };

  return (
    <div className="qr_container">
      {!showCartPage && !showPaymentPage && (
        <div className="lang-dropdown">
          <div className="lang-selected" onClick={toggleDropdown}>
            <span className="lang-name">
              {languages.find((l) => l.code === i18n.language)?.label || "Монгол"}
            </span>
            <img
              src={languages.find((l) => l.code === i18n.language)?.flag || flagMn}
              alt="flag"
              className="lang-flag"
            />
          </div>

          {dropdownOpen && (
            <div className="lang-options">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="lang-option"
                  onClick={() => changeLanguage(lang.code)}
                >
                  <img src={lang.flag} alt={lang.code} className="lang-flag" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPaymentPage ? (
        orderNumber ? (
          <div className="order_success">
            <p>Таны захиалгын дугаар</p>
            <div className="order_box">{orderNumber}</div>
          </div>
        ) : (
          <PaymentOptions
            amount={finalAmount}
            merchantId={decryptedData?.merchantId}
            siteId={siteId}
            ticketBinId={ticketBinId}
            cart={cart}
            paymentTypeId={paymentTypeId}
            siteMetaFromParent={siteMetaForPayment}
            onClose={() => {
              setShowPaymentPage(false);
              setShowCartPage(true);
            }}
            onSuccessClose={() => {
              setShowPaymentPage(false);
              setShowCartPage(false);
              setCart([]);
              setOrderNumber(null);
            }}
            onPaymentSuccess={(refNo) => setOrderNumber(refNo)}
          />
        )
      ) : showCartPage ? (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCartPage(false)}
          onProceedToPayment={(amount) => {
            setFinalAmount(amount);
            setShowCartPage(false);
            setShowPaymentPage(true);
          }}
        />
      ) : (
        <>
          <Category
            data={filteredCategories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />

          <p className="product_section_title">{t("inventory.products")}</p>

          <div className={`product_grid ${cart.length > 0 ? "has-cart" : ""}`}>
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={i}
                data={product}
                qty={cart.find((item) => item.invtId === product.invtId)?.qty || 0}
                onClick={() => handleAddToCart(product)}
                onRemove={handleRemoveFromCart}
              />
            ))}
          </div>

          {visibleProducts.length < products.length && (
            <div ref={loaderRef} style={{ textAlign: "center", padding: "20px" }}>
              {t("loading")}
            </div>
          )}

          {cart.length > 0 && (
            <div className="cart_bar" onClick={() => setShowCartPage(true)}>
              <div className="cart_icon_group">
                <div className="cart_icon">
                  <img src={cartIcon} alt="Cart" className="cart_img" />
                  <span className="cart_count">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                </div>
              </div>
              <div className="cart_total">
                {cart
                  .reduce((sum, item) => sum + item.price * item.qty, 0)
                  .toLocaleString()}
                ₮
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
