import React from 'react';

export function Footer(props){
  const { info } = props;

  return (
    <div className ='inv_footer_back'>
        <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <p style={{display: 'flex', width: 140, alignItems: 'center', justifyContent: 'center', fontSize: 12}}>
            Тамга
          </p>
          <div style={{lineHeight: 1}}>
            <p style={{fontSize: 12}}>Дарга ......................................................../.........................../</p>
            <p style={{fontSize: 12}}>Нягтлан бодогч ......................................../.........................../</p>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <p style={{fontSize: 12, fontWeight: 'bold'}}>{info?.footer}</p>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', flexFlow: 'row', alignItems: 'center', marginBottom: -15, marginRight: -15, marginTop: 10}}>
          <p style={{fontSize: 11, alignItems: 'center', margin:0, fontWeight: 500}}>Powered by</p>
          <a style={{marginLeft: 5, fontSize: 11, color: 'var(--logo1-color)'}} href='https://masu.mn'>www.masu.mn</a>
        </div>
    </div>
  );
}