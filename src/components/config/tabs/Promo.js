import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonRow, Error, Input, Overlay } from '../../all';

export function Promo(){
  const { t } = useTranslation();
  const [type, setType] = useState({ value: t('promo.type1') });
  const [perc, setPerc] = useState({ value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e?.preventDefault();
    let percent = parseFloat(perc?.value);
    if(type?.value?.trim() && !isNaN(percent)){
      setLoading(true);
      setTimeout(() => setLoading(false), 1200);
    } else {
      if(!type?.value?.trim()) setType({ value: '', error: t('error.not_empty') });
      if(isNaN(percent)) setPerc({ value: perc?.value, error: t('error.must_number') });
    }
  }

  const onClickCancel = () => {
    console.log('reset percent, name');
  }

  const handleEnter = e => {
    const form = e.target.form;
    const index = [...form].indexOf(e.target);
    form.elements[index + 1].focus();
    e.preventDefault();
  }
  
  const typeProps = { value: type, setValue: setType, label: t('promo.type'), setError, handleEnter };
  const percProps = { value: perc, setValue: setPerc, label: t('promo.percent'), setError, handleEnter: handleSubmit, mask: '99.99' };

  return (
    <Overlay loading={loading}>
      <div className='c_tab_cont' id='p_tab_cont'>
        <p className='c_tab_title'>{t('promo.title')}</p>
        <div className='c_tab_back'>
          <form onSubmit={handleSubmit}>
            <Input {...typeProps} />
            <Input {...percProps} />
          </form>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow onClickCancel={onClickCancel} onClickSave={handleSubmit} type='submit' />
      </div>
    </Overlay>
  )
}