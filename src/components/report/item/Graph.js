import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { chartTypes, formatNumber } from "../../../helpers";
import { AreaStack, BarStack, PlainSelect } from "../../all";

export function Graph(props) {
  const { bar, data, size, period, setPeriod, periodData } = props;
  const { t } = useTranslation();
  const [type, setType] = useState('bar');
  const [width, setWidth] = useState(300);
  const user = useSelector(state => state.login?.user);
  const currency = user?.msMerchant?.currency ?? '';

  useEffect(() => {
    if(size?.width >= 1290) setWidth(930);
    else if(size?.width >= 800) setWidth(size?.width - 360);
    else setWidth(size?.width - 30);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const tickFormatter = tick => {
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

  let id = size?.width >= 400 ? 'rr_large' : 'rr_small';
  let style = { width, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let chartProps = { style, data, bar, tickFormatter };

  const Chart = () => {
    if(type === 'line') return (<AreaStack {...chartProps} />);
    else if(type === 'pie') return (<div>pie</div>);
    else return (<BarStack {...chartProps} />);
  }

  let typeProps = { value: type, setValue: setType, data: chartTypes, className: 'rr_graph_select', bStyle: { } };
  let periodProps = { value: period, setValue: setPeriod, data: periodData, className: 'rr_graph_select',
    bStyle: { marginLeft: 15 } };

  return (
    <div className='ri_graph_back' id={id}>
      <div className='rr_graph_header'>
        <p className='rr_graph_title'>{t('report.top5_items1')} <span className='rr_graph_sub'>
          {t('report_review.thousand')}
        </span></p>
        <div className='rr_graph_selects'>
          <PlainSelect {...typeProps} />
          <PlainSelect {...periodProps} />
        </div>
      </div>
      <Chart />
    </div>
  );
}