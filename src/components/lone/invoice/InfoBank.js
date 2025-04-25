import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export function InfoBank(props){
  const { header } = props;
  const { t } = useTranslation();

  const Row = ({ label, value, date }) => (
    <div className="pay_row">
      <p className={'inv_label'}>{label}:</p>
      <p className={'inv_value'}>{date ? moment(value)?.format('YYYY.MM.DD') : value}</p>
    </div>
  );

  return (
    <div className="inv_bank_back">
      <div style={{display: 'flex', flexFlow: 'column', lineHeight: 2}}>
        <Row label={t('bill.invoice_number')} value={header?.salesNo} />
        <Row label={t('system.invoice_date')} value={header?.date} date/>
        <Row label={t('bill.invoice_enddate')} value={header?.date} date/>
      </div>
      <div style={{display: 'flex', flexFlow: 'column'}}>
        <Row label={t('employee.txn_descr')} value={header?.salesNo} />
        {/* <Row label={t('report_receipt.vat')} value={header?.totalVatAmount} />
        <Row label={t('report_receipt.pay')} value={header?.totalSalesAmount} /> */}
      </div>
    </div>
  );
}