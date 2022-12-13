import React from 'react';
import { useTranslation } from 'react-i18next';

export function Info(props){
  const { order } = props;
  const { t } = useTranslation();

  const Field = ({ label, value }) => {
    return (
      <div className='ps_info_row'>
        <p className='ps_info_label'>{t('order.' + label)}:</p>
        <p className='ps_info_value'>{value}</p>
      </div>
    );
  }

  return (
    <div className='ps_info_back'>
      <Field label='date' value={order?.orderDate} />
      {order?.reqDate ? <Field label='req' value={order?.reqDate} /> : null}
      <Field label='created' value={order?.createdUserName} />
      <div className='ps_col_back'>
        <div className='ps_col'>
          <p className='ps_col_title'>{t('order.vend')}:</p>
          <p className='ps_col_text'>{order?.vendName}</p>
          {order?.vendAddress ? <p className='ps_col_text'>{order?.vendAddress}</p>: null}
          {order?.vendPhone ? <p className='ps_col_text'>{order?.vendPhone}</p>: null}
          {order?.vendEmail ? <p className='ps_col_text'>{order?.vendEmail}</p>: null}
        </div>
        <div className='ps_gap' />
        <div className='ps_col'>
          <p className='ps_col_title'>{t('order.site')}:</p>
          <p className='ps_col_text'>{order?.siteName}</p>
          {order?.siteAddress ? <p className='ps_col_text'>{order?.siteAddress}</p>: null}
          {order?.sitePhone ? <p className='ps_col_text'>{order?.sitePhone}</p>: null}
        </div>
      </div>
    </div>
  );
}