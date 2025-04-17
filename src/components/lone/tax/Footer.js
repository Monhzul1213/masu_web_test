import React from 'react';

export function Footer(){

  return (
    <div className ='inv_footer_back'>
        <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <p style={{display: 'flex', width: 120, alignItems: 'center', justifyContent: 'center', fontSize: 13}}>
            Тамга
          </p>
          <div style={{lineHeight: 1}}>
            <p style={{fontSize: 13}}>Хүлээн авсан харилцагч ............................./.........................../</p>
            <p style={{fontSize: 13}}>Хүлээлгэн өгсөн ажилтан ............................/.........................../</p>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', flexFlow: 'row', alignItems: 'center', marginBottom: -15, marginRight: 5, marginTop: 5}}>
          <p style={{fontSize: 12, alignItems: 'center', margin:0, fontWeight: 500}}>Powered by</p>
          <a style={{marginLeft: 5, fontSize: 12, color: 'var(--logo1-color)'}} href='https://masu.mn'>www.masu.mn</a>
        </div>
    </div>
  );
}