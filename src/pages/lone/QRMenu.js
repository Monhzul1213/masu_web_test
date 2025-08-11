import React, { useEffect, useState, useRef, useMemo } from 'react';
import '../../css/qr.css';
import { Category } from '../../components/lone/qr/menu/Category';
import { ProductCard } from '../../components/lone/qr/menu/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { getList } from '../../services';
import { decrypt } from '../../helpers/encrypt';
import cartIcon from '../../assets/i3.png';
import { Cart } from './Cart';
import flagMn from "../../assets/flag_mn.png";
import flagEn from "../../assets/flag_en.png";
import flagKr from "../../assets/flag_kr.png";
import flagCn from "../../assets/flag_cn.png";
import flagGr from "../../assets/flag_gr.png";
import { useTranslation } from 'react-i18next';

export function QRMenu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCartPage, setShowCartPage] = useState(false);
  const [sliceIndex, setSliceIndex] = useState(1);
  const sliceSize = 50;
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const qrCodeParam = new URLSearchParams(window.location.search).get('qr');
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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("selectedLanguage", lang);
  setDropdownOpen(false);
};

  useEffect(() => {
    if (qrCodeParam) {
      try {
        const decrypted = decrypt(decodeURIComponent(qrCodeParam));
        const parts = decrypted.split('-');
        const [merchantId, siteIdStr, qrCode] = parts.map((p) => p.trim());

        const parsedSiteId = parseInt(siteIdStr, 10);
        if (!isNaN(parsedSiteId)) {
          setSiteId(parsedSiteId);
          setDecryptedData({ merchantId, qrCode });
        }
      } catch (e) {
        console.error('❌ QR decode error:', e);
      }
    }
  }, [qrCodeParam]);

  const fetchCategories = async () => {
    const res = await dispatch(getList(user, token, 'Inventory/GetCategory', null));
    if (res?.data) {
      setCategories(res.data);
      setSelectedCategoryId(null);
    }
  };
  
  const fetchProducts = async () => {
    if (!decryptedData || !siteId) return;

    const fixedToken = '20250722141616000AAAzaqbddsxSKJJCVd1';
    const query = `Integration/GetQrMenuPub?MerchantID=${decryptedData.merchantId}&SiteID=${siteId}&QRCode=${decryptedData.qrCode}`;

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
  };

const filteredCategories = useMemo(() => {
  const productCategoryIds = new Set(products.map(p => p.categoryId));

  return categories.filter(cat => productCategoryIds.has(cat.categoryId));
}, [categories, products]);

  useEffect(() => {
    if (decryptedData && siteId) {
      setProducts([]);
      setVisibleProducts([]);
      setSliceIndex(1);
      fetchProducts();
      fetchCategories();
    }
  }, [decryptedData, siteId]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [products, sliceIndex]);

  const loadMore = () => {
    const start = sliceIndex * sliceSize;
    const end = start + sliceSize;
    if (start < products.length) {
      setVisibleProducts((prev) => [...prev, ...products.slice(start, end)]);
      setSliceIndex((prev) => prev + 1);
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="qr_container">
      {!showCartPage && (
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
      {showCartPage ? (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCartPage(false)}
          merchantId={decryptedData?.merchantId}
          siteId={siteId}
        />
      ) : (
        <>
          <Category
            data={filteredCategories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
          <p className="product_section_title">{t('inventory.products')}</p>
          <div className={`product_grid ${cart.length > 0 ? 'has-cart' : ''}`}>
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
            <div ref={loaderRef} style={{ textAlign: 'center', padding: '20px' }}>
              {t('loading')}
            </div>
          )}

          {cart.length > 0 && (
            <div className="cart_bar" onClick={() => setShowCartPage(true)}>
              <div className="cart_icon_group">
                <div className="cart_icon">
                  <img src={cartIcon} alt="Cart" className="cart_img" />
                  <span className="cart_count">{totalItems}</span>
                </div>
              </div>
              <div className="cart_total">{cartTotal.toLocaleString()}₮</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}