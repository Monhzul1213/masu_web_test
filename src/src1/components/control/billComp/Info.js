import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { DynamicMDIcon } from '../../all/all_m';

const LabelIcon = props => {
  const { icon, value } = props;

  return (
    <div className='bl_icon_row'>
      <DynamicMDIcon name={icon} className='bl_icon' />
      <p className='bl_icon_value' style={{fontSize: 11}}>{value}</p>
    </div>
  );
}

const Label = props => {
  const { label, value } = props;

  return value ? (
    <div className='bl_row'>
      <p className='bl_label' style={{fontSize: 11}}>{label}: </p>
      <p className='bl_value' style={{fontSize: 11}}>{value}</p>
    </div>
  ) : null;
}

export function Info(props){
  const { header, image64, site} = props;
  const { t } = useTranslation();
  const isRefund = header?.salesType === 1;
  const date = moment(header?.salesDate).format('yyyy.MM.DD');

  return (
    <div>
      <p className='bl_title' style={{fontSize: 12}}>{header?.value}</p> 
      {image64 ? <img className='bl_image' src={image64} alt="Image" /> : null}
      <p className='bl_title' style={{fontSize: 12}}>{t(isRefund ? 'bill.refund' : 'bill.sales')}</p>
      <div className='bl_row'>
        <LabelIcon icon='MdPersonOutline' value={header?.cashierName ?? header?.cashierCode ?? 'Bold'} />
        <LabelIcon icon='MdStayCurrentPortrait' value={header?.terminalName ?? header?.terminalD ?? 'Pos2'} />
      </div>
      <Label label={t('bill.receipt_no')} value={'2029029292002'} />
      <Label label={t('bill.site')} value={'Twin Tower II'} />
      <Label label={t('bill.address')} value={'СБД 2-р хороо'} />
      <Label label={t('bill.phone')} value={'77092288'} />
      <Label label={t('bill.date')} value={date} />
      {isRefund ? <Label label={t('bill.refund')} value={'#' + header?.sourceNo} /> : null}
      {header?.custId ? <Label label={t('bill.customer')} value={(header?.custName ?? '') + ' - ' + (header?.custPhone ?? '')} /> : null}
      <div className='bl_gap' />
    </div>
  );
}