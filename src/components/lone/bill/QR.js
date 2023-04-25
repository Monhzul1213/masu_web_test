import React from 'react';
import { useTranslation } from 'react-i18next';

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

  return (
    <div className='bl_qr_back'>
      <div className='bl_qr' />
      <div className='bl_gap' />
      <div className='bl_qr_col'>
        <Label label={t('bill.ddtd')} value={header?.vatDdtd} />

      </div>
    </div>
  );
}

/**
 * <View style={receiptStyle.infoBack}>
      <QrImage value={header?.VAT_QR} portrait={portrait} />
      <View style={receiptStyle.infoCol}>
        {header?.VAT_CustomerID
          ? <Label label={t('receipt.company_regno')} value={header?.VAT_CustomerID} />
          : <Label label={t('receipt.lottery')} value={header?.VAT_LotteryNo} />}
        {header?.VAT_CustomerID
          ? <Label label={t('sales.company_name')} value={header?.VAT_CustomerName} />
          : <Label label={t('receipt.sales_total')} value={format(header?.PaidAmount) + Currency} />}
      </View>
    </View>
 */