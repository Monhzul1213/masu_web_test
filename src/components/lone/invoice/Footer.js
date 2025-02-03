import React from 'react';

export function Footer(){

  return (
    <div className ='inv_footer_back'>
        <div style={{lineHeight: 1}}>
          <p style={{fontSize: 13}}>Мөнгөн дүн ..............................................................................................................</p>
          <p style={{fontSize: 13}}> ....................................................................................................................... болно. </p>
        </div>
        <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <p style={{display: 'flex', width: 120, alignItems: 'center', justifyContent: 'center', fontSize: 13}}>
            Тамга
          </p>
          <div style={{lineHeight: 1}}>
            <p style={{fontSize: 13}}>Дарга ......................................................../.........................../</p>
            <p style={{fontSize: 13}}>Нягтлан бодогч ......................................../.........................../</p>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', flexFlow: 'row', alignItems: 'center'}}>
          <p style={{fontSize: 12, alignItems: 'center', margin:0, fontWeight: 500}}>Powered by</p>
          <a style={{marginLeft: 5, fontSize: 12, color: 'var(--logo1-color)'}} href='https://masu.mn'>www.masu.mn</a>
        </div>
    </div>
  );
}