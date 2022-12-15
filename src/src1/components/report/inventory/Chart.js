import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber, graphList1 } from '../../../../helpers';
import { LineChart, BarChart, PlainSelect, Empty1 } from '../../../components/all/all_m';

export function Graph(props){
  const { tab, setTab, total, size, periodData, period, setPeriod, data } = props;
  const { t } = useTranslation();
  const [isBar, setIsBar] = useState('bar');

 

  const xFormatter = value => {
    if(period === 'H') return value + ':00';
    else if(period === 'D') return moment(value)?.format('yyyy.MM.DD');
    else if(period === 'W') return value;
    else if(period === 'M') return value + t('page.month');
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let typeProps = { value: isBar, setValue: setIsBar, data: graphList1, className: 'rr_graph_select', bStyle: { } };
  let periodProps = { value: period, setValue: setPeriod, data: periodData, className: 'rr_graph_select', bStyle: { marginLeft: 15 } };
  let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
  let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let chartProps = { style, data, dataKey: period === 'W' ? 'weekInterval' : 'salesDate',
    bars: [{color: '#4BAF4F', fill: '#4BAF4F55', key: tab}], hasLegend: false,
    tickFormatter: tick => { return '₮' + formatNumber(tick) }, xFormatter, };

  return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back'>
      </div>
      <div className='rr_graph_back'>
        <div className='rr_graph_header'>
          <p className='rr_graph_title'>{t('report.grapic')}</p>
          <div className='rr_graph_selects'>
            <PlainSelect {...typeProps} />
            <PlainSelect {...periodProps} />
          </div>
        </div>
        {!data?.length
          ? <div style={style}><Empty1 icon='MdBarChart' /></div>
          : isBar ? <BarChart {...chartProps} /> : <LineChart {...chartProps} />}
      </div>
    </div>
  )
}