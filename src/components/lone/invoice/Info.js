import React from 'react';
import moment from 'moment';


export function Info(props){
  const { header } = props;

  return (
    <div>
        <p className='inv_header_t'>НЭХЭМЖЛЭХ №{header?.salesNo}</p>
        <div className='inv_row'>
            <div>
                <p className='inv_info'>Нэхэмжлэгч:</p> 
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Байгууллага:</p>
                  <p className='inv_info1'>{header?.cashierName}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Хаяг:</p>
                  <p className='inv_info1'>{header?.address}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Утас: Факс:</p>
                  <p className='inv_info1'>{header?.phone}</p>
                </div>
            </div>
            <div>
                <p className='inv_info'>Төлөгч:</p>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custName ? 'inv_info' : 'inv_info2'} style={{width: 140}}>Байгууллагын нэр:</p>
                  <p className='inv_info1'>{header?.custName ? header?.custName : '_________________'}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custPhone ? 'inv_info' : 'inv_info2' } style={{width: 140}}>Хаяг:</p>
                  <p className='inv_info1'>{header?.custPhone ? header?.custPhone : ' _____________________________'}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={'inv_info'} style={{width: 140}}>Нэхэмжилсэн огноо:</p>
                  <p className='inv_info1'>{moment().format('yyyy.MM.DD')}</p>
                </div>
            </div>
        </div>
    </div>
  );
}