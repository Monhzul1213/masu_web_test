import React from 'react';

export function Header(){

  return (
    <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <p style={{fontSize: 11}}>
          НХМаягт
        </p>
        <div >
          <p style={{fontSize: 11}}>Сангийн сайдын 2017 оны 12-р сарын 5-ний өдрийн 347 тоот тушаалын хавсралт</p>
        </div>
    </div>
  );
}