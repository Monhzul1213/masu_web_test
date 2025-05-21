import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber, graphList } from '../../../../helpers';
import { AreaChart, BarChart, PlainSelect, Empty1, Money } from '../../../../components/all';

export function Graph(props){
  const { tab, setTab, total, size, data } = props;
  const { t } = useTranslation();
  const [isBar, setIsBar] = useState(true);
  const user = useSelector(state => state.login?.user);
  const currency = user?.msMerchant?.currency ?? '';

  const Card = props => {
    const { label, value } = props;
    const style = label === tab ?  { borderColor: '#92278f' } : { };

    return (
      <div className='rr_card' style={style} onClick={() => setTab(label)}>
        <p className='rr_card_label'>{t('report_review.' + label)}</p>
        <div className='rr_card_value'><Money value={value} fontSize={20} /></div>
      </div>
    )
  }

  const xFormatter = value => {
   return value + ':00';
  }

  const tickFormatter = tick => {
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let typeProps = { value: isBar, setValue: setIsBar, data: graphList, className: 'dash_graph_select', bStyle: { } };
  let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
  let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let chartProps = { style, data, dataKey: 'salesDate',
    bars: [{color: '#4BAF4F', fill: '#4BAF4F55', key: tab}], hasLegend: false,
    tickFormatter, xFormatter,
    legendFormatter: () => t('report_review.' + tab),
    tipFormatter: (value, name, props) => [formatNumber(value) + currency, t('report_review.' + tab)] };

  return (
    <div className='dash_graph_cont' id={id}>
      <div className='rr_card_back'>
        <Card label='totalSalesAmt' isPos={true} value={total?.sales} />
        <Card label='totalReturnAmt' isPos={false} value={total?.refund} />
        <Card label='totalDiscAmt' isPos={false} value={total?.discount} />
        <Card label='totalNetSalesAmt' isPos={true} value={total?.net} />
        <Card label='totalProfitAmt' isPos={true} value={total?.profit} />
      </div>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'>
          <p className='rr_graph_title'>{t('report_review.' + tab)} <span className='rr_graph_sub'>{t('report_review.thousand')}</span></p>
          <div className='rr_graph_selects'>
            <PlainSelect {...typeProps} />
          </div>
        </div>
        {!data?.length
          ? <div style={style}><Empty1 icon='MdBarChart' id='empty_back' text={t('control.no_filter')}/></div>
          : isBar ? <BarChart {...chartProps} /> : <AreaChart {...chartProps} />}
      </div>
    </div>
  )
}