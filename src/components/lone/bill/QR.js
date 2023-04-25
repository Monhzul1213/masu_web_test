import React from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

import { Money } from '../../all';

const Label = props => {
  const { label, value } = props;

  return (
    <div>
      <p className='bl_qr_label'>{label}:</p>
      <p className='bl_qr_value'>{value}</p>
    </div>
  );
}

export function QR(props){
  const { header } = props;
  const { t } = useTranslation();

  return header?.vatQr ? (
    <div className='bl_qr_back'>
      <QRCode size={180} value={header?.vatQr} />
      <div className='bl_qr_col'>
        <Label label={t('bill.ddtd')} value={header?.vatDdtd} />
        {header?.vatCustomerId
          ? <Label label={t('bill.company_regno')} value={header?.vatCustomerId} />
          : <Label label={t('bill.lottery')} value={header?.vatLotteryNo} />}
        {header?.vatCustomerId
          ? <Label label={t('bill.company_name')} value={header?.vatCustomerName} />
          : <Label label={t('bill.sales_total')} value={<Money value={header?.paidAmount} fontSize={13} />} />}
      </div>
    </div>
  ) : null;
}