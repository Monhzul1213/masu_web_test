import React, { useState , useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber, graphList1 } from '../../../../helpers';
import { LineChart, BarChart,PieChart, PlainSelect, Empty1, Money } from '../../../components/all/all_m';
import { Table } from 'antd';

export function Graph(props){
  const { size, periodData, period, setPeriod, data } = props;
  const { t, i18n } = useTranslation();
  const [isBar, setIsBar] = useState('bar');
  const user = useSelector(state => state.login?.user);
  const currency = user?.msMerchant?.currency ?? '';

  useEffect(() => {
    console.log()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const Card = props => {
    const { label, value } = props;
    // const style = label === tab ?  { borderColor: 'var(--config-color)' } : { };
       data?.forEach(element => {
        // console.log(element);
       });
    return (
      <div className='rr_card_z' >
        <div className='rr_top_header'>
            <p className='rr_top_text'>{t('report.top5_items')}</p>
            <p className='rr_top_text1'>{t('report.net_sales')}</p>
        </div>
        <div className='rr_top_back'>
          
        </div>
      </div>
    )
  }

  const xFormatter = value => {
    if(period === 'H') return value + ':00';
    else if(period === 'D') return moment(value)?.format('yyyy.MM.DD');
    else if(period === 'W') return value;
    else if(period === 'M') return value + t('page.month');
  }

  const tickFormatter = tick => {
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let typeProps = { value: isBar, setValue: setIsBar, data: graphList1, className: 'rr_graph_select', bStyle: { } };
  let periodProps = { value: period, setValue: setPeriod, data: periodData, className: 'rr_graph_select', bStyle: { marginLeft: 15 } };
  let width = size?.width >= 1290 ? 1260 : (size?.width - 30);
  let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let chartProps = { style, data, dataKey: period === 'W' ? 'weekInterval' : 'salesDate',
    bars: [{color: '#4BAF4F', fill: '#4BAF4F55', key: 'totalNetSalesAmt'}], hasLegend: false,
    tickFormatter, xFormatter,
    tipFormatter: (value, name, props) => [formatNumber(value) + currency, name ]
   };

  return (
    <div className='rr_graph_cont' id={id}>
      <div className='rr_card_back_z'>
        <Card label='totalSalesAmt' />
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
          : isBar === 'bar' ? <BarChart {...chartProps} /> : (isBar === 'line'? <LineChart {...chartProps} />: <PieChart {...chartProps}/>)}
      </div>
    </div>
  )
}