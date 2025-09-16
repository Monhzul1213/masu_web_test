import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import noImage from '../../../../assets/masu_icons/no-image.png';

function resolveImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const m = path.match(/^C:\\MasuFiles\\Inventory\\(\d{8})\\([^\\]+)$/i);
  if (m) {
    const [, yyyymmdd, file] = m;
    return `https://app.masu.mn:8082/Inventory/${yyyymmdd}/${file}`;
  }
  return path.replace(/^C:\\MasuFiles\\?/, 'https://app.masu.mn:8082/').replace(/\\/g, '/');
}

export function ProductCard({ data, onClick, qty = 0, onRemove }) {
  const { t } = useTranslation();
  const inv = data?.inv ?? data ?? {};
  const [imageUrl, setImageUrl] = useState(noImage);

  const name = inv?.name || data?.name || '';
  const price = useMemo(() => {
    let p = inv?.price ?? data?.price ??
      (Array.isArray(data?.salesprice)
        ? data.salesprice.find(sp => sp?.invtId === (inv?.invtId ?? data?.invtId))?.price
        : undefined);
    if (p == null) return null;
    if (typeof p === 'number') return p;
    if (typeof p === 'string') {
      const n = Number(p.replace(/[^\d.-]/g, ''));
      return Number.isNaN(n) ? null : n;
    }
    return null;
  }, [inv?.price, data]);

  useEffect(() => {
    const url = resolveImageUrl(inv?.image || data?.image);
    setImageUrl(url || noImage);
  }, [inv?.image, data?.image]);

  const menuStatus = data?.__menuStatus ?? data?.menuitem?.status ?? data?.status ?? 1;
  const isDisabled = menuStatus === 0;

  if (!data) return null;

  return (
    <div
      className={`product_card ${isDisabled ? 'product_disabled' : ''}`}
      aria-disabled={isDisabled}
      onClick={() => { if (!isDisabled && onClick) onClick(inv); }}
    >
      {qty > 0 && !isDisabled && (
        <div className="product_overlay">
          <span className="product_qty_big">{qty}</span>
          <button
            className="product_remove_btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove && onRemove(inv?.invtId ?? data?.invtId);
            }}
          >×</button>
        </div>
      )}

      {isDisabled && (
        <div
          className="product_badge_unavailable"
          aria-label={t('orderType.unavailable_aria', 'Unavailable')}
          title={t('orderType.unavailable', 'Захиалах боломжгүй')}
        >
          {t('orderType.unavailable', 'Захиалах боломжгүй')}
        </div>
      )}

      <img
        src={imageUrl}
        alt={name || 'No name'}
        className="product_image"
        loading="lazy"
      />

      <div className="product_name">{name}</div>
      <div className={`product_price ${isDisabled ? 'product_price_disabled' : ''}`}>
        {price !== null ? price.toLocaleString() : ''}₮
      </div>
    </div>
  );
}
