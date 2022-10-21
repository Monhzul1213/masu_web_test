import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { payShops } from '../../../helpers';
import { ButtonRow, Error, Overlay, PlainSelect } from '../../all';

export function Receipt(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [shop, setShop] = useState({ value: null });

  useEffect(() => {
    setData(payShops);
    let value = payShops && payShops[0] && payShops[0]?.value;
    setShop({ value });
    return () => {};
  }, []);

  const onClickCancel = () => {}

  const handleSubmit = e => {}

  const shopProps = { value: shop, setValue: setShop, data, className: 'r_select' };

  return (
    <Overlay loading={loading}>
      <div className='c_tab_cont'>
        <div className='r_title_row'>
          <p className='c_tab_title'>{t('receipt.title')}</p>
          <PlainSelect {...shopProps} />
        </div>
        <div className='c_tab_back'>
          <form onSubmit={handleSubmit}>
          </form>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow onClickCancel={onClickCancel} onClickSave={handleSubmit} type='submit' />
      </div>
    </Overlay>
  );
}