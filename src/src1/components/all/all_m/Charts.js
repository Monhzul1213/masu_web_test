import React from 'react';
import { BarChart as ReBarChart, LineChart as ReLineChart, Bar, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function BarChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend, xFormatter } = props;

  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 15, left: 28, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tickFormatter={xFormatter} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} labelFormatter={xFormatter} />
          {hasLegend && <Legend formatter={legendFormatter} />}
          {bars?.map(item => {
            return (<Bar key={item?.key} maxBarSize={20} dataKey={item?.key} fill={item?.color} />);
          })}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend, xFormatter } = props;
  
  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
      <ReLineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tickFormatter={xFormatter} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} labelFormatter={xFormatter} />
          {hasLegend && <Legend formatter={legendFormatter} />}
          {bars?.map(item => {
            return (<Line key={item?.key} dataKey={item?.key} fill={item?.fill} stroke={item?.color} dot={{ fill: item?.color, strokeWidth: 1 }} />);
          })}
        </ReLineChart>
        
      </ResponsiveContainer>
    </div>
  )
}

// export function PieChart(props){
//   const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend, xFormatter } = props;
  
//   return (
//     <div style={style} className={className}>
//       <ResponsiveContainer width="100%" height="100%">
//       <RePieChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//            <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={renderCustomizedLabel}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//         </RePieChart>
        
//       </ResponsiveContainer>
//     </div>
//   )
// }