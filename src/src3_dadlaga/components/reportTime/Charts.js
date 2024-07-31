import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';
import { AreaChart, Empty1, Money } from '../../../components/all';

export function Charts(props){
  const { total, size, data } = props;
  const { t } = useTranslation();
  const user = useSelector(state => state.login?.user);
  const currency = user?.msMerchant?.currency ?? '';
  const [bars] = useState([{color: '#4BAF4F', fill: '#4BAF4F55', key: 'salesAmount'}, {color: '#9c27b0', fill: '#8c27b0', key: 'returnAmount'}])


  const xFormatter = value => {
    return value + ':00';
  }

  const tickFormatter = tick => {
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
  let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let chartProps = { style, data, dataKey: 'salesTime', bars, hasLegend: false,
    tickFormatter, xFormatter,
    legendFormatter: () => t('report_time.'),
    tipFormatter: (value, label) => [formatNumber(value) + currency, t('report_time.' + label)] 
    };
    return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'>
        </div>
        {!data?.length
          ? <div style={style}><Empty1 icon='MdBarChart' /></div>
          : <AreaChart {...chartProps} />}
      </div>
      {!data?.length ? null : <div className='rr_card_back1'>
          <div className='rp_row_back'>
              <div style={{width: 15, height: 15, backgroundColor: '#4BAF4F55', borderWidth: 1, borderStyle: 'solid', borderColor: '#4BAF4F55', borderRadius: 5, marginTop: 3}}/>
              <p className='rp_row_text'>{t('report_time.' + 'salesAmount')}: <Money value={total?.sales}/></p>
          </div>
          <div className='rp_row_back'>
              <div style={{width: 15, height: 15, backgroundColor: '#9c27b0', borderWidth: 1, borderStyle: 'solid', borderColor: '#9c27b0', borderRadius: 5, marginTop: 3}}/>
              <p className='rp_row_text'>{t('report_time.' + 'returnAmount')}: <Money value={total?.refund}/></p>
          </div>
        </div>}
    </div>
  )
}