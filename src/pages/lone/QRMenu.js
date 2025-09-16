import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  const [customerInfo, setCustomerInfo] = useState(null);

  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const qrCodeParam = new URLSearchParams(window.location.search).get("qr");
  const loaderRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [useDelivery, setUseDelivery] = useState(null);
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
  const baseProducts = useMemo(() => {
   if (selectedCategoryId == null) return products;
   const sel = Number(selectedCategoryId);
   return products.filter(p => p && Number(p.categoryId) === sel);
 }, [products, selectedCategoryId]);

 const hasMore = visibleProducts.length < baseProducts.length;

 const sliceSize = 50;
 const isLoadingMoreRef = useRef(false);
 const loadMore = useCallback(() => {
  if (isLoadingMoreRef.current) return;
  isLoadingMoreRef.current = true;

  setVisibleProducts(prev => {
    const start = prev.length;
    const end = start + sliceSize;
    if (start >= baseProducts.length) {
      return prev;
    }
    return [...prev, ...baseProducts.slice(start, end)];
  });

  requestAnimationFrame(() => { isLoadingMoreRef.current = false; });
}, [baseProducts, sliceSize]);

  useEffect(() => {
   isLoadingMoreRef.current = false;
   setVisibleProducts(baseProducts.slice(0, sliceSize));
 }, [baseProducts, sliceSize]);

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

 const apiUseDelivery = res?.data?.config?.[0]?.useDelivery ?? null;
 setUseDelivery(typeof apiUseDelivery === "string" ? apiUseDelivery.toUpperCase() : null);

  if (Array.isArray(res?.data?.inventory)) {
  const normalized = res.data.inventory.map(it => {
    const inv = it?.inv ?? it ?? {};
    const categoryId = Number(inv.categoryId ?? inv.categoryID ?? inv.catid);
    const price =
      typeof inv.price === 'number'
        ? inv.price
        : (typeof inv.price === 'string'
            ? Number(inv.price.replace(/[^\d.-]/g, ''))
            : null);

    return {
      ...inv,
      price,
      categoryId: Number.isFinite(categoryId) ? categoryId : null,
      __menuStatus: it?.menuitem?.status ?? it?.status ?? 1,
    };
  });

  normalized.sort((a, b) => {
    const sa = Number(a.__menuStatus ?? 1);
    const sb = Number(b.__menuStatus ?? 1);
    if (sb !== sa) return sb - sa;
    return (a.name || '').localeCompare(b.name || '');
  });

  setProducts(normalized);
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
  const isDefault = (p) => p.isDefault === true || p.isDefault === "Y" || p.default === true;
  const isActive = (p) => p.isActive === true || p.active === true || (p.status ?? 1) === 1;
  const qpayCandidate = ptList.find((p) => {
    const name = getName(p);
    return name.includes("qpay") || name.includes("q pay");
  });
  const defaultCandidate = ptList.find((p) => isDefault(p));
  const firstActive = ptList.find((p) => isActive(p));
  const chosen = qpayCandidate || defaultCandidate || firstActive || ptList[0];
  const chosenId = getId(chosen);
  if (Number.isFinite(chosenId) && chosenId > 0) setPaymentTypeId(chosenId);
  else setPaymentTypeId(null);
 
  const rawTerminals = res?.data?.terminals ?? res?.data?.terminal ?? [];
  const list = Array.isArray(rawTerminals) ? rawTerminals : [rawTerminals].filter(Boolean);
 
  const mapped = list
    .map((x) => ({
      id: Number(x?.terminalId ?? x?.terminalID ?? x?.id),
      systemType: Number(x?.systemType ?? x?.system_type ?? x?.system ?? 0),
    }))
    .filter((x) => Number.isFinite(x.id));
 
  const preferred = mapped.find((x) => x.systemType === 0);
  const selectedTerminalId = preferred?.id ?? mapped[0]?.id ?? null;
  const sites = res?.data?.sites || [];
  const matched = sites.find((s) => Number(s.siteId) === Number(siteId));
 
  setSiteMetaForPayment(
    matched || selectedTerminalId
      ? {
          bankCode: matched?.bank ?? null,
          accountNumber: matched?.bankAccount ?? null,
          accountName: matched?.bankAccountName ?? null,
          useQrMenu: matched?.useQrMenu ?? null,
          terminalId: selectedTerminalId ?? null,
        }
      : null
  );
};
 
    const filteredCategories = useMemo(() => {
    const productCategoryIds = new Set(
      products
        .map(p => Number(p?.categoryId))
        .filter(n => Number.isFinite(n))
    );
    return categories.filter(cat =>
      productCategoryIds.has(Number(cat?.categoryId))
    );
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
   if (!loaderRef.current || !hasMore) return;
  const el = loaderRef.current;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    { rootMargin: "200px" }
  );
  observer.observe(el);
  return () => {
    observer.unobserve(el);
    observer.disconnect();
  };
}, [hasMore, loadMore]);
 
  const filteredProducts = visibleProducts;
 
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
    <div className={`qr_container ${
      cart.length > 0 && !showCartPage && !showPaymentPage ? "with-cart" : ""
      }`}
    >
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
          null
        ) : (
          <PaymentOptions
            amount={finalAmount}
            merchantId={decryptedData?.merchantId}
            siteId={siteId}
            ticketBinId={ticketBinId}
            cart={cart}
            paymentTypeId={paymentTypeId}
            siteMetaFromParent={siteMetaForPayment}
            customerInfo={customerInfo}
            useDelivery={useDelivery}
            debugFrom="QRMenu"
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
          useDelivery={useDelivery}
          onProceedToPayment={(payload) => {
            const amount =
              typeof payload === "number" ? payload : Number(payload?.amount ?? 0);
            const ci =
              typeof payload === "number" ? null : payload?.customerInfo ?? null;
 
            setFinalAmount(amount);
            setCustomerInfo(ci ?? null);
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
                key={product?.invtId ?? i}
                data={product}
                qty={cart.find((item) => item.invtId === product.invtId)?.qty || 0}
                onClick={() => handleAddToCart(product)}
                onRemove={handleRemoveFromCart}
              />
            ))}
          </div>
 
          {hasMore && (
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
 