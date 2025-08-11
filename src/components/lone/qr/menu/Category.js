import React from 'react';
import { useTranslation } from 'react-i18next';
import { icons } from '../../../../assets'; 
import '../../../../css/qr.css';

export function Category({ data, selectedId, onSelect }) {
  const { t } = useTranslation();

  const renderItem = (item) => {
    const isSelected = selectedId === item.categoryId;

    const iconSrc = item?.icon
      ? icons[item.icon - 1] 
      : '/images/placeholder.png';

    const handleClick = () => {
      if (isSelected) {
        onSelect(null);
      } else {
        onSelect(item.categoryId);
      }
    };

    return (
      <div
        key={item.categoryId}
        className={`cat_back ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
      >
        <div className="cat_icon_wrapper1">
          <img src={iconSrc} alt={item.categoryName} className="cat_icon1" />
        </div>
        <p className="in_header2s">{item.categoryName}</p>
      </div>
    );
  };

  return (
    <div>
      <p className="qr_section_title">{t('inventory.category')}</p>
      <div className="cat_conBack">
        {data?.map(renderItem)}
      </div>
    </div>
  );
}