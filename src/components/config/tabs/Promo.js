import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Overlay } from '../../all';

export function Promo(){
  const { t } = useTranslation();
  const [type, setType] = useState({ value: t('promo.type1') });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {

  }

  const handleEnter = e => {
    const form = e.target.form;
    const index = [...form].indexOf(e.target);
    form.elements[index + 1].focus();
    e.preventDefault();
  }
  
  const typeProps = { value: type, setValue: setType, label: t('promo.type'), setError, handleEnter };

  return (
    <Overlay loading={loading}>
      <div className='c_tab_cont' id='t_tab_cont'>
        <div className='t_tab_back'>
          <p className='c_tab_title' id='t_title'>{t('promo.title')}</p>
          <form onSubmit={handleSubmit}>
            <Input {...typeProps} />
          </form>
        </div>
      </div>
    </Overlay>
  )
}