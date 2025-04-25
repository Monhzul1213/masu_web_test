import React from 'react';
import moment from 'moment';


export function Info(props){
  const { header } = props;

  return (
      <div className="inv_row1">
        <div style={{ display: 'flex' }}>
          <p className="inv_info">Байгууллага:</p>
          <p className="inv_info1">{header?.siteName}</p>
        </div>
        <div style={{ display: 'flex' }}>
          <p className={'inv_info'}>Харилцагч:</p>
          <p className="inv_info1">{header?.custName}</p>
        </div>

        <div style={{ display: 'flex' }}>
          <p className="inv_info">Борлуулагч:</p>
          <p className="inv_info1">{header?.cashierName}</p>
        </div>
        <div style={{ display: 'flex' }}>
          <p className="inv_info">Утас:</p>
          <p className="inv_info1">{header?.custPhone}</p>
        </div>

        <div style={{ display: 'flex' }}>
          <p className="inv_info">Огноо:</p>
          <p className="inv_info1">{moment().format('yyyy.MM.DD')}</p>
        </div>
        <div style={{ display: 'flex' }}>
          <p className="inv_info" style={{ width: 120 }}>Төлбөрийн хэлбэр:</p>
          <p className="inv_info1">{''}</p>
        </div>
      </div>

  );
}