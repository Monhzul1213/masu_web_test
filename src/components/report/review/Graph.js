import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';

export function Graph(props){
  const { tab, setTab } = props;
  const { t } = useTranslation();
  
  const Card = props => {
    const { label, value1, value2, value3, isPos, index } = props;
    const color = !value3 ? 'var(--text-color)' : ((isPos && value3 > 0) || (!isPos && value3 < 0)) ? 'var(--success-color)' : 'var(--danger-color)';
    const style = index === tab ?  { borderColor: 'var(--config-color)' } : { };

    return (
      <button className='rr_card' style={style} onClick={() => setTab(index)}>
        <p className='rr_card_label'>{t('report_review.' + label)}</p>
        <p className='rr_card_value'>₮{formatNumber(value1)}</p>
        <p className='rr_card_value1' style={{ color }}>₮{formatNumber(value2)} ({value3 ?? 0}%)</p>
      </button>
    )
  }

  return (
    <div className='rr_graph_cont'>
      <div className='rr_card_back'>
        <Card label='c_sales' index={0} isPos={true} />
        <Card label='c_refund' index={1} isPos={false} />
        <Card label='c_discount' index={2} isPos={false} />
        <Card label='c_net' index={3} isPos={true} />
        <Card label='c_profit' index={4} isPos={true} />
      </div>
    </div>
  )
}