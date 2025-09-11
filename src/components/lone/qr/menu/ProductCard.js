import React, { useEffect, useState } from 'react';
import noImage from '../../../../assets/masu_icons/no-image.png';

export function ProductCard({ data, onClick, qty = 0, onRemove }) {
  const [imageUrl, setImageUrl] = useState(noImage);

  useEffect(() => {
    if (!data?.image) {
      setImageUrl(noImage);
      return;
    }
    const normalizedPath = data.image.replace(/^C:\\MasuFiles\\?/, "https://app.masu.mn:8082/");
    const finalUrl = normalizedPath.replace(/\\/g, "/");
    setImageUrl(finalUrl);
  }, [data?.image]);
 
  if (!data) return null;
 
  return (
    <div className="product_card" onClick={() => onClick && onClick(data)}>
      {qty > 0 && (
        <div className="product_overlay">
          <span className="product_qty_big">{qty}</span>
          <button
            className="product_remove_btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove && onRemove(data.invtId);
            }}
          >
            ×
          </button>
        </div>
      )}
 
      <img
        src={imageUrl}
        alt={data.name || 'No name'}
        className="product_image"
        loading="lazy"
      />
      <div className="product_name">{data.name}</div>
      <div className="product_price">{data.price?.toLocaleString()}₮</div>
    </div>
  );
}
