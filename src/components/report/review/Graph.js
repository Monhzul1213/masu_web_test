import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';

export function Graph(props){
  const { tab, setTab, total } = props;
  const { t } = useTranslation();
  
  const Card = props => {
    const { label, value, index } = props;
    // const color = !value3 ? 'var(--text-color)' : ((isPos && value3 > 0) || (!isPos && value3 < 0)) ? 'var(--success-color)' : 'var(--danger-color)';
    const style = index === tab ?  { borderColor: 'var(--config-color)' } : { };

    return (
      <div className='rr_card' style={style} onClick={() => setTab(index)}>
        <p className='rr_card_label'>{t('report_review.' + label)}</p>
        <div className='rr_card_value'>₮{formatNumber(value)}</div>
        {/* <p className='rr_card_value1' style={{ color }}>₮{formatNumber(value2)} ({value3 ?? 0}%)</p> */}
      </div>
    )
  }

  return (
    <div className='rr_graph_cont'>
      <div className='rr_card_back'>
        <Card label='c_sales' index={0} isPos={true} value={total?.sales} />
        <Card label='c_refund' index={1} isPos={false} value={total?.refund} />
        <Card label='c_discount' index={2} isPos={false} value={total?.discount} />
        <Card label='c_net' index={3} isPos={true} value={total?.net} />
        <Card label='c_profit' index={4} isPos={true} value={total?.profit} />
      </div>
    </div>
  )
}