import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export function Info(props){
  const { header } = props;
  const { t } = useTranslation();

  return (
    <div className='bo_info'>
      <p className='bo_powered'>{t('order_bill.powered')}</p>
      <p className='bo_no'>{t('order_bill.title')}: #{header?.orderNo}</p>
      <div className='bo_row'>
        <div className='bo_col'>
          <p className='bo_label'>{t('order_bill.ordered')}: <span className='bo_value'>{header?.merchantName}</span></p>
          <p className='bo_label'>{t('order_bill.reg_no')}: <span className='bo_value'>{header?.merchantRegNo}</span></p>
          <p className='bo_label'>{t('order_bill.employee')}: <span className='bo_value'>{header?.orderEmpName} - {header?.orderEmpPhone}</span></p>
          <p className='bo_label'>{t('order_bill.date')}: <span className='bo_value'>{moment(header?.orderDate).format('yyyy.MM.DD')}</span></p>
          <p className='bo_label'>{t('order_bill.req_date')}: <span className='bo_value'>{header?.reqDate}</span></p>
          {header?.notes ? <p className='bo_label'>{t('order_bill.descr')}: <span className='bo_value'>{header?.notes}</span></p> : null}
        </div>
        <QRCode
          value={header?.orderNo}
          // logoImage={require('../../../assets/logo.png')}
          size={135}
          fgColor='#1d1d27'
          logoWidth={40}
          logoHeight={40} />
      </div>
      <div className='bo_row'>
        <div className='bo_col'>
          <p className='bo_label'>{t('order_bill.vendor')}:</p>
          {header?.vendName ? <p className='bo_value2'>{header?.vendName}</p> : null}
          {header?.vendAddress ? <p className='bo_value2'>{header?.vendAddress}</p> : null}
          {header?.vendPhone ? <p className='bo_value2'>{header?.vendPhone}</p> : null}
        </div>
        <div className='bl_gap' />
        <div className='bo_col'>
          <p className='bo_label'>{t('order_bill.receive')}:</p>
          {header?.siteName ? <p className='bo_value2'>{header?.siteName}</p> : null}
          {header?.siteAddress ? <p className='bo_value2'>{header?.siteAddress}</p> : null}
          {header?.sitePhone ? <p className='bo_value2'>{header?.sitePhone}</p> : null}
        </div>
      </div>
    </div>
  );
}