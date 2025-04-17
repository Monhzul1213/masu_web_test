import React from 'react';
import { Money } from '../../all';
import { useTranslation } from 'react-i18next';

export function Pay({ header }) {
  const { t } = useTranslation();

  const Row = ({ label, value }) => (
    <div className="pay_row">
      <p className={'pay_label'}>{label}:</p>
      <p className={'pay_value'}>
        <Money value={value} fontSize={13} />
      </p>
    </div>
  );

  return (
    <div className="pay_section">
      <div style={{display: 'flex', flexFlow: 'column'}}>
        <Row label={t('report_receipt.amt')} value={header?.totalAmount} />
        <Row label={t('report_receipt.discount')} value={header?.totalDiscountAmount} />
        <Row label={t('report_receipt.pure')} value={header?.pureAmount} />
      </div>
      <div style={{display: 'flex', flexFlow: 'column'}}>
        <Row label={t('report_receipt.nhat')} value={header?.totalNhatamount} />
        <Row label={t('report_receipt.vat')} value={header?.totalVatAmount} />
        <Row label={t('report_receipt.pay')} value={header?.totalSalesAmount} />
      </div>
    </div>
  );
}
