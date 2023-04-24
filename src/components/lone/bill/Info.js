import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { DynamicMDIcon } from '../../all';

const LabelIcon = props => {
  const { icon, value } = props;

  return (
    <div className='bl_icon_row'>
      <DynamicMDIcon name={icon} className='bl_icon' />
      <p className='bl_icon_value'>{value}</p>
    </div>
  );
}

const Label = props => {
  const { label, value } = props;

  return value ? (
    <div className='bl_row'>
      <p className='bl_label'>{label}: </p>
      <p className='bl_value'>{value}</p>
    </div>
  ) : null;
}

export function Info(props){
  const { header } = props;
  const { t } = useTranslation();
  const isRefund = header?.salesType === 1;
  const date = moment(header?.salesDate).format('yyyy.MM.DD');

  return (
    <div>
      <p className='bl_title'>{t(isRefund ? 'bill.refund' : 'bill.sales')}</p>
      <div className='bl_row'>
        <LabelIcon icon='MdPersonOutline' value={header?.cashierName ?? header?.cashierCode} />
        <LabelIcon icon='MdStayCurrentPortrait' value={header?.terminalName ?? header?.terminalD} />
      </div>
      <Label label={t('bill.receipt_no')} value={header?.salesNo} />
      <Label label={t('bill.site')} value={header?.siteName} />
      <Label label={t('bill.address')} value={header?.siteAddress} />
      <Label label={t('bill.phone')} value={header?.sitePhone} />
      <Label label={t('bill.date')} value={date} />
      {isRefund ? <Label label={t('bill.refund')} value={'#' + header?.sourceNo} /> : null}
      {header?.custId ? <Label label={t('bill.customer')} value={header?.custId + ' - ' + (header?.custName ?? '')} /> : null}
    </div>
  );
}