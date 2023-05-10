import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../css/report.css';
import { Money } from '../../../components/all/all_m';

export function Card(props){
  const { total, size} = props;
  const { t } = useTranslation();


  const Card1 = props => {
    const { label, value } = props;
    return (
      <div className='rr_card_tax' >
        <p className='rr_card_label_z'>{t('report.' + label)}</p>
        <div className='rr_card_value_z'><Money value={value} fontSize={20} /></div>
      </div>
    )
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back'>
        <Card1 label='total_sales' value={total?.sales} />
        <Card1 label='noat'  value={total?.vat} />
        <Card1 label='nhat'  value={total?.nhat} />
      </div>
     
    </div>
  )
}