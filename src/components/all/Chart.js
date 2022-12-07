import React from 'react';
import { BarChart as ReBarChart, AreaChart as ReAreaChart, Bar, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function BarChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend } = props;

  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 5, left: 28, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} />
          {hasLegend && <Legend formatter={legendFormatter} />}
          {bars?.map(item => {
            return (<Bar maxBarSize={32} dataKey={item?.key} fill={item?.color} />);
          })}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend } = props;
  
  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 5, left: 28, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} />
          {hasLegend && <Legend formatter={legendFormatter} />}
          {bars?.map(item => {
            return (<Area dataKey={item?.key} fill={item?.color} stroke={item?.color} />);
          })}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}