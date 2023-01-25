import React from 'react';
import { useTranslation } from 'react-i18next';

import { topColors } from '../../../helpers';
import { Money } from '../../all';

export function Top(props){
  const { data } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    let backgroundColor = topColors && topColors[index];
    return (
      <div key={index} className='ri_top_item'>
        <div className='ri_top_circle' style={{ backgroundColor }} />
        <p className='ri_top_name'>{item?.invtName}</p>
        <p className='ri_top_value'><Money value={item?.totalNetSalesAmt} fontSize={14} /></p>
      </div>
    );
  }

  return (
    <div className='ri_top_back'>
      <div className='ri_top_header'>
        <p className='ri_top_title'>{t('report.top5_items')}</p>
        <p className='ri_top_label'>{t('report.net_sales')}</p>
      </div>
      <div className='ri_top_list'>
        {data?.map(renderItem)}
      </div>
    </div>
  );
}