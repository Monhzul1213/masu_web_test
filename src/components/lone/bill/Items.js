import React from 'react';

import { Money } from '../../all';
import { bonus, coupon } from '../../../src1/assets'

export function Items(props){
  const { detail, bill } = props;

  const renderItem = (item, index) => {
    const showBarCode = bill?.isPrintBarCode === 'Y' && item?.barCode;
    const service = (item?.serviceName ?? item?.serviceCode) + (item?.serviceDescr ? (', ' + item?.serviceDescr) : '');
    return (
      <div key={index} className='bl_item'>
        <div className='bl_item_row'>
          <p className='bl_header1'>{item?.invtName ?? item?.invtId}</p>
          <p className='bl_header2'>{item?.qty}</p>
          <p className='bl_header3'><Money value={item?.price} fontSize={13} currency='₮' /></p>
          <p className='bl_header4'><Money value={item?.amount} fontSize={13} currency='₮' /></p>
        </div>
        {showBarCode ? <p className='bl_item_descr'>{item?.barCode}</p> : null}
        {item?.serviceCode ? <p className='bl_item_descr'>{service}</p> : null}
        <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            {item?.couponAmount ? <img src={coupon} className='dr_img' alt='coupon'/> : ''}
            <p className='dr_item_text_z2'>{ (item?.couponName ? item?.couponName : '')}</p>
          </div>
          <p className='dr_item_text_z2'>{item?.couponAmount ? <Money value={item?.couponAmount}/> : ''}</p>
        </div>
        {item?.bonusId !== 0 ? <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            <img src={bonus} className='dr_bonus_img' alt='coupon'/>
            <p className='dr_item_text_z2'>{item?.bonusName}</p>
          </div>
          <p className='dr_item_text_z2'><Money value={item?.rewardAmount}/></p>
        </div> : null}
      </div>
    );
  }
  
  return (
    <div>{detail?.map(renderItem)}</div>
  );
}