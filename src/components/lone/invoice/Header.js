import React from 'react';

export function Header(){

  return (
    <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <p style={{fontSize: 11}}>
          НХМаягт
        </p>
        <div style={{display: 'flex', flexFlow: 'column', alignItems: 'flex-end', lineHeight: 0.1}}>
          <p style={{fontSize: 10}}>Санхүү, эдийн засгийн сайд</p>
          <p style={{fontSize: 10}}>Үндэсний статистикийн газрын</p>
          <p style={{fontSize: 10}}>даргын 2008 оны 6-р сарын 18ны</p>
          <p style={{fontSize: 10}}>171-111 тоот тушаалын хавсралт</p>
        </div>
    </div>
  );
}