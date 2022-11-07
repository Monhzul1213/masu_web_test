import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { CardOption } from '../../components/invt/modifier/add';

export function ModifierAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [items, setItems] = useState([]);
  const [dItems, setDItems] = useState([]);
  
  const optionProps = { name, setName, setError, data: items, setData: setItems, setDItems };

  return (
    <Overlay className='i_container' loading={loading}>
      <div className='i_scroll'>
        {error && <Error1 error={error} />}
        <form>
          <CardOption {...optionProps} />
        </form>
      </div>
    </Overlay>
  )
}