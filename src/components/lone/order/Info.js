import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export function Info(props){
  const { header } = props;
  const { t } = useTranslation();

  return (
    <div className='bo_header'>
      <p className='bo_powered'>{t('order_bill.powered')}</p>
      <p className='bo_no'>{t('order_bill.title')}: #{header?.orderNo}</p>
      <div className='bo_row'>
        <div className='bo_col'>
          <p className='bo_label'>{t('order_bill.ordered')}: <span className='bo_value'>{header?.custName}</span></p>
          <p className='bo_label'>{t('order_bill.reg_no')}: <span className='bo_value'>{header?.custRegNo}</span></p>
          <p className='bo_label'>{t('order_bill.employee')}: <span className='bo_value'>{header?.custRegNo}</span></p>
          <p className='bo_label'>{t('order_bill.date')}: <span className='bo_value'>{moment(header?.orderDate).format('yyyy.MM.DD')}</span></p>
          <p className='bo_label'>{t('order_bill.req_date')}: <span className='bo_value'>{header?.reqDate}</span></p>
          {header?.notes ? <p className='bo_label'>{t('order_bill.descr')}: <span className='bo_value'>{header?.notes}</span></p> : null}
        </div>
        <QRCode
          value="https://github.com/gcoro/react-qrcode-logo"
          logoImage={require('../../../assets/logo.png')}
          size={135}
          fgColor='#6f0ad2'
          logoWidth={48}
          logoHeight={16} />
      </div>
      <div className='bo_row'>
        <div className='bo_col'>
          <p className='bo_label'>{t('order_bill.vendor')}:</p>
          {header?.name ? <p className='bo_value2'>{header?.name1}</p> : null}
          {header?.name ? <p className='bo_value2'>{header?.name1}</p> : null}
          {header?.name ? <p className='bo_value2'>{header?.name1}</p> : null}
        </div>
        <div className='bl_gap' />
        <div className='bo_col'>
          <p className='bo_label'>{t('order_bill.receive')}:</p>
          {header?.name ? <p className='bo_value2'>{header?.name1}</p> : null}
          {header?.name ? <p className='bo_value2'>{header?.name1}</p> : null}
          {header?.name ? <p className='bo_value2'>{header?.name1}</p> : null}
        </div>
      </div>
    </div>
  );
}