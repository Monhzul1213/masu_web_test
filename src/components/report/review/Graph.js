import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber, graphList } from '../../../helpers';
import { AreaChart, BarChart, PlainSelect } from '../../all';

export function Graph(props){
  const { tab, setTab, total, size, periodData, period, setPeriod, data } = props;
  const { t } = useTranslation();
  const [isBar, setIsBar] = useState(true);

  const Card = props => {
    const { label, value } = props;
    const style = label === tab ?  { borderColor: 'var(--config-color)' } : { };

    return (
      <div className='rr_card' style={style} onClick={() => setTab(label)}>
        <p className='rr_card_label'>{t('report_review.' + label)}</p>
        <div className='rr_card_value'>₮{formatNumber(value)}</div>
      </div>
    )
  }

  const xFormatter = value => {
    if(period === 'H') return value + ':00';
    else if(period === 'D') return moment(value)?.format('yyyy.MM.DD');
    else if(period === 'W') return value;
    else if(period === 'M') return value + t('page.month');
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let typeProps = { value: isBar, setValue: setIsBar, data: graphList, className: 'rr_graph_select', bStyle: { } };
  let periodProps = { value: period, setValue: setPeriod, data: periodData, className: 'rr_graph_select', bStyle: { marginLeft: 15 } };
  let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
  let chartProps = { style: { width, height: 360 }, data, dataKey: period === 'W' ? 'weekInterval' : 'salesDate',
    bars: [{color: '#4BAF4F', key: tab}], hasLegend: false,
    tickFormatter: tick => { return '₮' + formatNumber(tick) }, xFormatter,
    legendFormatter: () => t('report_review.' + tab),
    tipFormatter: (value, name, props) => ['₮' + formatNumber(value), t('report_review.' + tab)] };

  return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back'>
        <Card label='totalSalesAmt' isPos={true} value={total?.sales} />
        <Card label='totalReturnAmt' isPos={false} value={total?.refund} />
        <Card label='totalDiscAmt' isPos={false} value={total?.discount} />
        <Card label='totalNetSalesAmt' isPos={true} value={total?.net} />
        <Card label='totalProfitAmt' isPos={true} value={total?.profit} />
      </div>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'>
          <p className='rr_graph_title'>{t('report_review.' + tab)}</p>
          <div className='rr_graph_selects'>
            <PlainSelect {...typeProps} />
            <PlainSelect {...periodProps} />
          </div>
        </div>
        {isBar ? <BarChart {...chartProps} /> : <AreaChart {...chartProps} />}
      </div>
    </div>
  )
}