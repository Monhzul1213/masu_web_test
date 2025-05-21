import React, { useEffect, useState } from 'react';
import { FaShoppingBasket } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../components/all/all_m';
import { DynamicAIIcon } from '../../../../components/all';
import { SalesDetail } from './SalesDetail';
import { SalesOrder } from './SalesOrder';
import { SalesAr } from './SalesAr';
import { SalesRemain } from './SalesRemain';

export function CardHeader(props){
  const { total, size, salesData, orderData, total1, arData, total2, remainData, total3} = props;
  const [width, setWidth] = useState(210);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let width = 250;
    if(size?.width >= 1290) width = calcWidth(1290, 5);
    else if(size?.width < 1290 && size?.width >= 1000) width = calcWidth(size?.width, 4);
    else if(size?.width < 1000 && size?.width >= 750) width = calcWidth(size?.width, 3);
    else if(size?.width < 750 && size?.width >= 500) width = calcWidth(size?.width, 2);
    else if(size?.width < 500) width = calcWidth(size?.width, 1);
    setWidth(width);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const calcWidth = (wid, num) => {
    return (wid - 30 - (num - 1) * 10) / num;
  }

  const closeModalSales = () => {
    setVisible(false);
  }

  const onClickSales = () => {
    setVisible(true);
  }

  const closeModalOrder = () => {
    setVisible1(false);
  }

  const onClickOrder = () => {
    setVisible1(true);
  }

  const closeModalAr = () => {
    setVisible2(false);
  }

  const onClickAr = () => {
    setVisible2(true);
  }

  const closeModalRemain = () => {
    setVisible3(false);
  }

  const onClickRemain = () => {
    setVisible3(true);
  }

  const detailProps = { data: salesData ?? [], visible, closeModal: closeModalSales, size};
  const detailOrderProps = { data : orderData, visible: visible1, closeModal: closeModalOrder, size};
  const detailArProps = { data : arData, visible: visible2, closeModal: closeModalAr, size};
  const detailRemProps = { data : remainData, visible: visible3, closeModal: closeModalRemain, size};

  const color = 'var(--root-color)', color1 = 'var(--text-color)';
  return (
    <>    
      {visible && <SalesDetail {...detailProps} />}
      {visible1 && <SalesOrder {...detailOrderProps} />}
      {visible2 && <SalesAr {...detailArProps} />}
      {visible3 && <SalesRemain {...detailRemProps} />}
      <div className='rw_card_back' >
        <div className='dash_head_back' style={{ width, backgroundColor:'#4baf4f' }}>
          <p className='dash_head_text1' style={{ color }}>{t('report_receipt.c_title2')}</p>
          <div className='dash_head_col'>
            <Money value={total?.sales} className='dash_head_text2' style={{ color }} fontSize ={25}/>
            <div className='dash_card_row'>
              <div className='dash_card_row3' style={{backgroundColor: 'var(--root-color)'}}>
                <FaShoppingBasket className='dash_card_basket1' />
                <p className='dash_card_count' style={{color: 'var(--text-color)'}}>{total?.salesQty}</p>
              </div> 
              <DynamicAIIcon name='AiFillRightCircle' className='dash_card_icon2' onClick={onClickSales}/>
            </div>
          </div>
        </div>
        <div className='dash_head_back' style={{ width, backgroundColor: '#92278f' }}>
          <p className='dash_head_text1' style={{ color }}>{t('menu.invt_remainder')}</p>
          <div className='dash_head_col'>
            <p className='dash_head_text2' style={{ color }}>{total3?.qty}</p>
            <div className='dash_card_row'>
              <Money value={total3?.cost} className='dash_head_text3' style={{ color }} fontSize ={12}/>
              <DynamicAIIcon name='AiFillRightCircle' className='dash_card_icon2' onClick={onClickRemain}/>
            </div>
          </div>
        </div>
        <div className='dash_head_back' style={{ width, border: '1px solid #5959596b' }}>
          <p className='dash_head_text1' style={{ color: color1 }}>{t('menu.report_order')}</p>
          <div className='dash_head_col'>
            <Money value={total1?.totalAmt} className='dash_head_text4' fontSize ={25}/>
            <div className='dash_card_row'>
              <div className='dash_card_row3' style={{backgroundColor: '#f5e751'}}>
                <FaShoppingBasket className='dash_card_basket1' />
                <p className='dash_card_count' style={{color: 'var(--text-color)'}}>{total1?.totalQty}</p>
              </div> 
              <DynamicAIIcon name='AiFillRightCircle' className='dash_card_icon1' onClick={onClickOrder}/>
            </div>
          </div>
        </div>
        <div className='dash_head_back' style={{ width, border: '1px solid #5959596b' }}>
          <p className='dash_head_text1' style={{ color: color1 }}>{t('menu.report_receivable')}</p>
          <div className='dash_head_col'>
            <Money value={total2?.amt} className='dash_head_text4' fontSize ={25}/>
            <div className='dash_card_row'>
              <div className='dash_card_row2' >
                <Money value={total2?.totalBeginAmt} className='dash_head_text5'/>
                <p className='dash_card_cash'>|</p>
                <p className='dash_card_count1' style={{color: 'var(--text-color)'}}>{t('report.beginBalance')}</p>
              </div> 
              <DynamicAIIcon name='AiFillRightCircle' className='dash_card_icon1' onClick={onClickAr}/>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}