import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber, graphList } from '../../../helpers';
import { Empty1, Money } from '../../all';
import { AreaChart } from '../../all';
import { timeList } from '../../../helpers';

export function Charts(props){
    const { tab, setTab, total, size, periodData, period, setPeriod, data } = props;
    const { t } = useTranslation();
    const [isBar, setIsBar] = useState(true);
    const user = useSelector(state => state.login?.user);
    const currency = user?.msMerchant?.currency ?? '';
    const [bars] = useState([{color: '#4BAF4F', fill: '#4BAF4F55', key: 'salesAmount'}, {color: '#9c27b0', fill: '#8c27b0', key: 'returnAmount'}])

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

  const xFormatter = (value, period) => {
    if (period === 'H') {
        return timeList[value]; 
    } else {
        return value + ':00'; 
    }
 }

  const tickFormatter = tick => {
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

    let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
    let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
    let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
    let chartProps = { style, data, dataKey: 'salesTime', bars, 
        hasLegend: false,
        tickFormatter, 
        xFormatter,
        legendFormatter: () => t('report_time.' + tab),
        tipFormatter: (value, label) => [formatNumber(value) + currency, t('report_time.' + label)] 
    };

    return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back'>
        <Card label='salesAmount' isPos={true} value={total?.sales} />
        <Card label='returnAmount' isPos={false} value={total?.refund} />
      </div>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'></div>
        {!data?.length
          ? <div style={style}><Empty1 icon='MdBarChart' /></div>
          :  <AreaChart {...chartProps} />}
      </div>
    </div>
  )
}