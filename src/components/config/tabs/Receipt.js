import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonRow, Error, Overlay } from '../../all';

export function Receipt(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onClickCancel = () => {}

  const handleSubmit = e => {}

  return (
    <Overlay loading={loading}>
      <div className='c_tab_cont'>
        <p className='c_tab_title'>{t('receipt.title')}</p>
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