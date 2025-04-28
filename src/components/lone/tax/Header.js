import React from 'react';
// import { header_image } from '../../../assets';

export function Header(props){
  const { header } = props;

  return (
    <div className='inv_header_back'>
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