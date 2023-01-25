import React from 'react';
import { BarChart, AreaChart, Bar, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function BarStack(props){
  const { style, className, data, tickFormatter, bar, tipFormatter } = props;
  console.log(style)
  
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
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} />
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

/*
export function BarChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend, xFormatter } = props;

  return (
    <div style={style} className={className}>
      
    </div>
  )
}

export function AreaChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend, xFormatter } = props;
  
  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 15, left: 18, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tickFormatter={xFormatter} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} labelFormatter={xFormatter} />
          {hasLegend && <Legend formatter={legendFormatter} />}
          {bars?.map(item => {
            return (<Area key={item?.key} dataKey={item?.key} fill={item?.fill} stroke={item?.color} dot={{ fill: item?.color, strokeWidth: 1 }} />);
          })}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
*/