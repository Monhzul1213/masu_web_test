import React from 'react';
import { bank_icons } from '../../../assets';

export function Footer(props){
const { accounts, isA4 } = props;

  return (
    <div className ='inv_footer_back'>
        <div className='iline1'/>
        <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <p className='inv_tamga'>Тамга</p>
          <div style={{display: 'flex', flexFlow: 'column', justifyContent: 'flex-middle',marginRight: 20, }}>
            {isA4 && accounts && accounts.slice(0, 3).map((item, idx) => (
            <div key={idx} className="footer-bank-row">
             <img
             src={bank_icons[item?.bank]}
             alt={item?.bank}
             onError={e => { e.target.style.display = 'none'; }}
             />
            <span>{item?.account}</span>
             </div>
             ))}
            <p style={{fontSize: 12, fontWeight:500, margin: '14px 14'}}>Хүлээн авсан ...................................../.........................../</p>
            <p style={{fontSize: 12, fontWeight:500, margin: '14px 14'}}>Хүлээлгэн өгсөн ................................./.........................../</p>
          </div>
        </div>
        {/* <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <p style={{fontSize: 12, fontWeight: 'bold'}}>{info?.footer}</p>
        </div> */}
        <div className='inv_footer_back1'>
          <div>
            <p style={{fontSize: 11, alignItems: 'center', margin:0, color: 'white', fontWeight: 500}}>Бидэнтэй хамтран ажилласан танд баярлалаа.</p>
          </div>
          <div className='row'>
            <p style={{fontSize: 11, alignItems: 'center', margin:0, color: 'white'}}>Powered by</p>
            <a style={{marginLeft: 5, fontSize: 11, fontWeight: 500, color: 'white'}} href='https://masu.mn'>www.masu.mn</a>
          </div>
        </div>
    </div>
  );
}