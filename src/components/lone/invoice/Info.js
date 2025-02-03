import React from 'react';


export function Info(props){
  const { info, header } = props;

  return (
    <div>
        <p className='inv_header_t'>НЭХЭМЖЛЭХ №......</p>
        <div className='inv_row'>
            <div>
                <p className='inv_info'>Нэхэмжлэгч:</p> 
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Байгууллагын нэр:</p>
                  <p className='inv_info1'>{info?.header}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Хаяг:</p>
                  <p className='inv_info1'>{header?.address}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Утас: Факс:</p>
                  <p className='inv_info1'>{header?.phone}</p>
                </div>
                {/* <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Э_шуудан:</p>
                  <p className='inv_info1'> _____________________</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Банкны нэр:</p>
                  <p className='inv_info1'>__________</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className='inv_info'>Банкны дансны дугаар:</p>
                  <p className='inv_info1'>__________</p>
                </div> */}
                <p className='inv_info2'>Э_шуудан: _________________________</p>
                <p className='inv_info2'>Банкны нэр:________________________</p>
                <p className='inv_info2'>Банкны дансны дугаар:______________</p>
            </div>
            <div>
                <p className='inv_info'>Төлөгч:</p>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custName ? 'inv_info' : 'inv_info2'}>Байгууллагын нэр:</p>
                  <p className='inv_info1'>{header?.custName ? header?.custName : '_________________'}</p>
                </div>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                  <p className={header?.custPhone ? 'inv_info' : 'inv_info2'}>Хаяг:</p>
                  <p className='inv_info1'>{header?.custPhone ? header?.custPhone : ' _____________________________'}</p>
                </div>
                <p className='inv_info2'>Гэрээний №______________________</p>
                <p className='inv_info2' style={{height: 20}}></p>
                <p className='inv_info2'>Нэхэмжилсэн огноо_______________</p>
                <p className='inv_info2'>Төлбөр хийх хугацаа_______________</p>
            </div>
        </div>
    </div>
  );
}