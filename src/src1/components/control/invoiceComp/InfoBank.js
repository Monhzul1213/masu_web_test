import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export function InfoBank(props){
  const { header, endDate } = props;
  const { t } = useTranslation();

  const Row = ({ label, value, date, date1 }) => (
    <div className="pay_row">
      <p className={'inv_label'} style={{fontSize: 10, fontWeight: 500}}>{label}:</p>
      <p className={'inv_value'} style={{fontSize: 10}}>{date ? moment(value)?.format('YYYY.MM.DD') : date1 ? moment(endDate?.value)?.format('YYYY.MM.DD') : value}</p>
    </div>
  );

  return (
    <div className="inv_bank_back">
      <div style={{display: 'flex', flexFlow: 'column', lineHeight: 2}}>
        <Row label={t('bill.invoice_number')} value={header?.salesNo?? '3930293093999'} />
        <Row label={t('system.invoice_date')} value={header?.date} date/>
        <Row label={t('bill.invoice_enddate')} value={header?.date} date1/>
      </div>
      <div style={{display: 'flex', flexFlow: 'column'}}>
        <Row label={t('employee.txn_descr')} value={header?.salesNo ?? '202504301700'} />
        {/* <Row label={t('report_receipt.vat')} value={header?.totalVatAmount} />
        <Row label={t('report_receipt.pay')} value={header?.totalSalesAmount} /> */}
      </div>
    </div>
  );
}