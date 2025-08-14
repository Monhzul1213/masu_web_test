import React from 'react';
// import { header_image } from '../../../assets';

export function Header(props){
  const { header } = props;

  return (
    <div className='inv_header_back_a5'>
      <div className='inv_row'>
        <p className='inv_header_text'>НЭХЭМЖЛЭХ</p>
        <p className='inv_header_text1'>№{header?.salesNo}</p>
      </div>
      <div>
        {/* {image?.data ? <img src={`data:image/jpeg;base64,${image.data}`} alt='LOGO' className='inv_header_image' style={{height: 25}}/> : null} */}
      </div>
    </div>
  );
}