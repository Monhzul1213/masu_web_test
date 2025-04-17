import React, { useEffect, useState } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/report.css';
import { Button, DynamicAIIcon, DynamicRIIcon, Money } from '../../all';
import { config, encrypt } from '../../../helpers';
import { bonus, coupon } from '../../../src1/assets'

export function Drawer(props){
  const { selected, open, setOpen } = props;
  const { t } = useTranslation();
  const [pureAmount, setPureAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if(selected){
      let pure = (selected?.sale?.totalSalesAmount ?? 0) -
        (selected?.sale?.totalVatAmount ?? 0) - (selected?.sale?.totalNhatamount ?? 0);
      setPureAmount(pure);
      setTotalAmount((selected?.sale?.totalCashAmount ?? 0) + (selected?.sale?.totalNonCashAmount ?? 0));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onClose = () => setOpen(null);

  const renderItem = (item, index) => {
    let variant = item?.variantName ? (' (' + item?.variantName  + ')') : ''
    return (
      <div key={index} className='dr_item1'>
        <div key={index} className='dr_item_row'>
          <p className='dr_item_text1'>{item?.invtName ?? item?.invtId}{variant}</p>
          <p className='dr_item_text2'>{item?.qty}</p>
          <p className='dr_item_text3'><Money value={item?.price} fontSize={13} /></p>
          <p className='dr_item_text4'><Money value={item?.amount} fontSize={13} /></p>
        </div>
        <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            {item?.couponAmount ? <img src={coupon} className='dr_img' alt='coupon'/> : ''}
            <p className='dr_item_text_z2'>{item?.couponName ? (item?.couponName) : ''}</p>
          </div>
          <p className='dr_item_text_z2'>{item?.couponAmount ? <Money value={item?.couponAmount}/> : ''}</p>
        </div>
        {item?.bonusID !== 0 ? 
          <div className='dr_item_text_back'>
            <div className='dr_img_back'>
              {<img src={bonus} className='dr_bonus_img' alt='coupon'/>}
              <p className='dr_item_text_z2'>{item?.bonusName}</p>
            </div>
            <p className='dr_item_text_z2'>{<Money value={item?.rewardAmount}/>}</p>
          </div> 
        : ''}
        <p className='dr_item_text'>{(item?.serviceCode !== 0 && item?.serviceCode !==null) ? ( t('report_receipt.t_emp')+ ': ' + item?.empName ) : ''}</p>
      </div>
    )
  }

  const renderItem1 = (item) => {
    return (
      <div className='dr_row_m'>
          <p className='dr_row_label_m'>{item?.paymentTypeName}</p>
          <p className='dr_row_value_m'><Money value={item?.paymentAmount} fontSize={13} /></p>
      </div> 
    )
  }

  const Field = props => {
    const { icon, label, value } = props;
    
    return (
      <div className='dr_field'>
        <DynamicRIIcon className='dr_field_icon' name={icon} />
        <p className='dr_field_label'>{t(label)}</p>
        <p className='dr_field_label1'>:</p>
        <p className='dr_field_value'>{value}</p>
      </div>
    )
  }

  const onClickLink = () => {
    let msg = selected?.sale?.merchantId + '-' + selected?.sale?.siteId + '-' + selected?.sale?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

  const onClickInvoice = () => {
    let msg = selected?.sale?.merchantId + '-' + selected?.sale?.siteId + '-' + selected?.sale?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/inv_pdf?invoiceNo=' + encodeURIComponent(code);
    window.open(url);
  }

  const onClickTax = () => {
    let msg = selected?.sale?.merchantId + '-' + selected?.sale?.siteId + '-' + selected?.sale?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/tax_pdf?invoiceNo=' + encodeURIComponent(code);
    window.open(url);
  }

  const drawerProps = { className: 'rp_drawer', placement: 'right', onClose, closable: false, open, mask: false };

  return (
    <AntDrawer {...drawerProps}>
      <div className='dr_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <p className='dr_title'>{selected?.sale?.salesTypeName}</p>
        <Field icon='RiUserLine' label='time.t_emp' value={selected?.sale?.cashierName} />
        <Field icon='RiDeviceLine' label='report_receipt.pos' value={selected?.sale?.terminalDescr} />
        <Field icon='RiStore2Line' label='report_receipt.dr_site' value={selected?.sale?.siteName} />
        <div className='dr_field'>
          <DynamicRIIcon className='dr_field_icon' name={'RiBillLine'} />
          <p className='dr_field_label'>{t('report_receipt.dr_no')}</p>
          <p className='dr_field_label1'>:</p>
          <a className='table_link' onClick={onClickLink}>{selected?.sale?.salesNo}</a>
        </div>
        <Field icon='RiCalendarLine' label='system.date' value={moment(selected?.sale?.createdDate)?.format('yyyy.MM.DD HH:mm:ss')} />
        <Field icon='RiTeamLine' label='menu.customer' value={selected?.customer} /> 
        <div className='dr_header'>
          <p className='dr_header_text1'>{t('report_receipt.invt')}</p>
          <p className='dr_header_text2'>{t('report_receipt.qty')}</p>
          <p className='dr_header_text3'>{t('report_receipt.price')}</p>
          <p className='dr_header_text4'>{t('report_receipt.amt')}</p>
        </div>
        <div className='dr_list'>
          {selected?.saleitem?.map(renderItem)}
        </div>
        <div style={{padding: '5px 0 5px 0'}}>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.amt')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.discount')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalDiscountAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.pay')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.sale?.totalSalesAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.pure')}</p>
            <p className='dr_row_value'><Money value={pureAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.nhat')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalNhatamount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.vat')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalVatAmount} fontSize={13} /></p>
          </div>
          <div className='dr_line' />
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.cash')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalCashAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.non_cash')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalNonCashAmount} fontSize={13} /></p>
          </div>
          {selected?.paymentitem?.map(renderItem1)}
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.paid')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={totalAmount} fontSize={13} /></p>
          </div>
        </div>
        <div className='dr_row_back'>
          <Button className='invoice_btn' id='invt_btn_save' text={t('system.tax_print')} onClick={onClickTax}/>
          <Button className='invoice_btn1' id='invt_btn_save' text={t('system.invoice')} onClick={onClickInvoice}/>
        </div>
      </div>
    </AntDrawer>
  );
}