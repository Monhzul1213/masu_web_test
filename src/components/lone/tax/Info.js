import React from 'react';
import moment from 'moment';
import { bank_icons } from '../../../assets';

export function Info(props){
  const { header, accounts = [], isA4 } = props;

  return (
    <div className={isA4 ? "inv_row2" : "inv_row1"}>
      <div style={{ display:'flex' }}>
        <p className="inv_info">Байгууллага:</p>
        <p className="inv_info1">{header?.siteName}</p>
      </div>

      <div style={{ display:'flex' }}>
        <p className="inv_info">Харилцагч:</p>
        <p className="inv_info1">{header?.custName}</p>
      </div>

      <div style={{ display:'flex' }}>
        <p className="inv_info">Борлуулагч:</p>
        <p className="inv_info1">{header?.cashierName}</p>
      </div>

      <div style={{ display:'flex' }}>
        <p className="inv_info">Утас:</p>
        <p className="inv_info1">{header?.custPhone}</p>
      </div>

      <div style={{ display:'flex' }}>
        <p className="inv_info">Огноо:</p>
        <p className="inv_info1">{moment().format('YYYY.MM.DD')}</p>
      </div>

      <div style={{ display:'flex' }}>
        <p className="inv_info" style={{ width:120 }}></p>
        <p className="inv_info1">{''}</p>
      </div>
      
      <div className="info-line">
  <p className="inv_info">Данс:</p>
  <div className="inv_info1">
    {accounts?.length ? (
      <div className="bank-list">
        {accounts.map((item, idx) => (
          <div key={idx} className="bank-row">
            <img
              src={bank_icons[item?.bank]}
              alt={item?.bank}
              className="bank-icon"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="bank-text">
              {item?.account} {item?.accountName} {item?.phone}
            </span>
          </div>
        ))}
      </div>
    ) : (header?.account || '—')}
  </div>
</div>

    </div>
  );
}
