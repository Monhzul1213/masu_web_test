import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { formatNumber, graphList } from '../../../helpers';
import { PlainSelect } from '../../all';

export function Graph(props){
  const { tab, changeTab, total, size, periodData, period, setPeriod, graphData } = props;
  const { t } = useTranslation();
  const [isBar, setIsBar] = useState(true);

  const Card = props => {
    const { label, value } = props;
    const style = label === tab ?  { borderColor: 'var(--config-color)' } : { };

    return (
      <div className='rr_card' style={style} onClick={() => changeTab(label)}>
        <p className='rr_card_label'>{t('report_review.' + label)}</p>
        <div className='rr_card_value'>₮{formatNumber(value)}</div>
      </div>
    )
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let typeProps = { value: isBar, setValue: setIsBar, data: graphList, className: 'rr_graph_select', bStyle: { } };
  let periodProps = { value: period, setValue: setPeriod, data: periodData, className: 'rr_graph_select', bStyle: { marginLeft: 15 } };

  return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back'>
        <Card label='c_sales' isPos={true} value={total?.sales} />
        <Card label='c_refund' isPos={false} value={total?.refund} />
        <Card label='c_discount' isPos={false} value={total?.discount} />
        <Card label='c_net' isPos={true} value={total?.net} />
        <Card label='c_profit' isPos={true} value={total?.profit} />
      </div>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'>
          <p className='rr_graph_title'>{t('report_review.' + tab)}</p>
          <div className='rr_graph_selects'>
            <PlainSelect {...typeProps} />
            <PlainSelect {...periodProps} />
          </div>
        </div>
      </div>
    </div>
  )
}