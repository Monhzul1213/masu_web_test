import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { bank_icons } from '../../../assets';

export function InfoBank(props){
  const { header, account, day } = props;
  const { t } = useTranslation();

  const Row = ({ label, value, date, date1 }) => (
    <div className="pay_row">
      <p className={'inv_label'}>{label}:</p>
      <p className={'inv_value'}>{date ? moment(value)?.format('YYYY.MM.DD') : date1 ? moment(value)?.add(day?.invoiceDays, 'days')?.format('YYYY.MM.DD') : value}</p>
    </div>
  );

  return (
    <div className="inv_bank_back">
      <div style={{display: 'flex', flexFlow: 'column', lineHeight: 2}}>
        <Row label={t('bill.invoice_number')} value={header?.salesNo} />
        <Row label={t('system.invoice_date')} value={header?.date} date/>
        <Row label={t('bill.invoice_enddate')} value={header?.date} date1/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {account && account.length > 0 && account.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0, // зайг жигд өгөх
              fontSize: 10,
            }}
          >
            <img
              className='es_select_icon'
              style={{ width: 13, height: 13, flexShrink: 0 }}
              src={bank_icons[item?.bank]}
              alt={item?.bank}
            />
            <span className='inv_value'>{item?.account}</span>
          </div>
        ))}
      </div>
    </div>
  );
}