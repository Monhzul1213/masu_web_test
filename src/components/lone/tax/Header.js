import React from 'react';
// import { header_image } from '../../../assets';

export function Header(props){
  const { header, isA4 } = props;

  return (
    <div className={isA4 ? 'inv_header_back' : 'inv_header_back_a5'}>
      <div className='inv_row'>
        <p className='inv_header_text'>ЗАРЛАГЫН БАРИМТ</p>
        <p className='inv_header_text1'>№{header?.salesNo}</p>
      </div>
      <div>
        {/* <img src={header_image} alt='MASU LOGO' className='inv_header_image'/> */}
      </div>
    </div>
  );
}