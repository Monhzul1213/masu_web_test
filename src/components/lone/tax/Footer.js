import React from 'react';

export function Footer(props){
  const { info } = props;

  return (
    <div className ='inv_footer_back'>
        <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <p style={{display: 'flex', width: 120, alignItems: 'center', justifyContent: 'center', fontSize: 12}}>
            Тамга
          </p>
          <div style={{lineHeight: 1, marginTop: 20}}>
            <p style={{fontSize: 12}}>Хүлээн авсан харилцагч ............................./.........................../</p>
            <p style={{fontSize: 12}}>Хүлээлгэн өгсөн ажилтан ............................/.........................../</p>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <p style={{fontSize: 12, fontWeight: 'bolder'}}>{info?.footer}</p>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', flexFlow: 'row', alignItems: 'center', marginBottom: -15, marginRight: 5, marginTop: 5}}>
          <p style={{fontSize: 11, alignItems: 'center', margin:0, fontWeight: 500}}>Powered by</p>
          <a style={{marginLeft: 5, fontSize: 11, color: 'var(--logo1-color)'}} href='https://masu.mn'>www.masu.mn</a>
        </div>
    </div>
  );
}