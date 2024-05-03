import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber, graphList } from '../../../helpers';
import { AreaChart, Empty1, Money } from '../../all';

export default function Charts(props){
  const { tab, setTab, total, size, period,setPeriod,periodData, data } = props;
  const { t } = useTranslation();
  const [isBar, setIsBar] = useState(true);
  const user = useSelector(state => state.login?.user);
  const currency = user?.msMerchant?.currency ?? '';

  const Card = props => {
    const { label, value } = props;
    const style = label === tab ?  { borderColor: 'var(--config-color)' } : { };

    return (
      <div className='rr_card' style={style} onClick={() => setTab(label)}>
        <p className='rr_card_label'>{t('report_time.' + label)}</p>
        <div className='rr_card_value'><Money value={value} fontSize={20} /></div>
      </div>
    )
  }

  const xFormatter = value => {
    return value + ':00';
  }


  const tickFormatter = tick => {
    // console.log(tick, 'tick')
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
  let periodProps = { value: period, setValue: setPeriod, data: periodData, className: 'rr_graph_select', bStyle: { marginLeft: 15 } };
  let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let chartProps = { style, data, dataKey: 'salesTime',
    bars: [{color: '#8884d8', fill: '#8884d8',  key: tab}], hasLegend: false,
    tickFormatter, xFormatter,
    legendFormatter: () => t('report_review.' + tab),
    tipFormatter: (value, name, props) => [formatNumber(value) + currency, t('report_time.' + tab)] };

    return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back'>
        <Card label='salesAmount' isPos={true} value={total?.sales} />
        <Card label='returnAmount' isPos={true} value={total?.refund} />
      </div>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'>
        </div>
        {!data?.length
          ? <div style={style}><Empty1 icon='MdBarChart' /></div>
          : <AreaChart {...chartProps} />}
      </div>
    </div>
  )
}