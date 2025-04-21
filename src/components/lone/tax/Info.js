import React from 'react';
import moment from 'moment';


export function Info(props){
  const { header } = props;

  return (
    <div>
        <p className='inv_header_t'>ЗАРЛАГЫН БАРИМТ №{header?.salesNo}</p>
        <div className='inv_row'>
            <div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Байгууллага:</p>
                  <p className='inv_info1'>{header?.siteName}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Борлуулагч:</p>
                  <p className='inv_info1'>{header?.cashierName}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Огноо:</p>
                  <p className='inv_info1'>{moment().format('yyyy.MM.DD')}</p>
                </div>
            </div>
            <div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custName ? 'inv_info' : 'inv_info2'} style={{width: 140}}>Харилцагч:</p>
                  <p className='inv_info1'>{header?.custName}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custPhone ? 'inv_info' : 'inv_info2' } style={{width: 140}}>Утас:</p>
                  <p className='inv_info1'>{header?.custPhone}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custPhone ? 'inv_info' : 'inv_info2' } style={{width: 140}}>Төлбөрийн хэлбэр:</p>
                  <p className='inv_info1'>{''}</p>
                </div>
            </div>
        </div>
    </div>
  );
}