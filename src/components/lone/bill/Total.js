import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../all';

const Label = props => {
  const { label, value, id } = props;

  return (
    <div className='bl_total_row' id={id}>
      <p className='bl_total_text'>{label}</p>
      <p className='bl_total_text'><Money value={value} fontSize={13} currency='₮' /></p>
    </div>
  );
}

export function Total(props){
  const { header, payments } = props;
  const { t } = useTranslation();

  const renderPayment = (item, index) => {
    return (
      <div className='bl_total_row' key={index}>
        <p className='bl_total_text1'>{item?.paymentTypeName}</p>
        <p className='bl_total_text2'><Money value={item?.paymentAmount} fontSize={12} currency='₮' /></p>
      </div>
    );
  }

  return (
    <div>
      <div className='bl_gap' />
      <Label label={t('bill.amt')} value={header?.totalAmount} id='bl_total_bold' />
      <Label label={t('bill.discount')} value={header?.totalDiscountAmount} />
      <Label label={t('bill.pure')} value={header?.pureAmount} />
      <Label label={t('bill.nhat')} value={header?.totalNhatamount} />
      <Label label={t('bill.vat')} value={header?.totalVatAmount} />
      <Label label={t('bill.pay_vat')} value={header?.totalSalesAmount} id='bl_total_bold' />
      <div className='bl_gap' />
      <div className='bl_dash' />
      <div className='bl_gap' />
      <Label label={t('bill.cash')} value={header?.totalCashAmount} />
      <Label label={t('bill.noncash')} value={header?.totalNonCashAmount} />
      {payments?.map(renderPayment)}
      <Label label={t('bill.paid')} value={header?.paidAmount} id='bl_total_bold' />
      <div className='bl_gap' />
      <div className='bl_dash' />
      <div className='bl_gap' />
    </div>
  );
}