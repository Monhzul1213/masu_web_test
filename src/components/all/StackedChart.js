import React from 'react';
import { BarChart, AreaChart, Bar, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { Money } from './Money';

const CustomTooltip = ({ active, payload, label }) => {
  let hide = payload && payload[0]?.payload?.hide;
  let items = [];
  if(!hide){
    let value = payload && payload[0]?.payload;
    for (let index = 0; index < 5; index++) {
      let item = value && value['row' + index];
      if(item?.amt) items.push(item);
    }
  }
  if(active && payload && payload.length && !hide) {
    return (
      <div className="ri_tooltip">
        <p className="ri_tooltp_lbl">{label}</p>
        {items?.map((item, index) => {
          return (
            <p key={index} className='ri_tooltip_item' style={{ color: item?.color }}>
              {item?.name} : <Money value={item?.amt} fontSize={13} />
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

export function BarStack(props){
  const { style, className, data, tickFormatter, bar } = props;
  
  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 15, left: 18, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip /> } />
          {bar?.map((item, index) => {
            return (
              <Bar
                key={index}
                dataKey={'row' + index + '.amt'}
                stackId="1"
                stroke={item?.color}
                fill={item?.color}
                id={'area' + index}
                name={item?.invtName} />
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaStack(props){
  const { style, className, data, tickFormatter, bar } = props;
  
  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 15, left: 18, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip /> } />
          {bar?.map((item, index) => {
            return (
              <Area
                key={index}
                dataKey={'row' + index + '.amt'}
                stackId="1"
                stroke={item?.color}
                fill='transparent'
                id={'area' + index}
                dot={{ fill: item?.color, strokeWidth: 1 }}
                name={item?.invtName} />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}