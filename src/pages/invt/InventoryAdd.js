import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { getList } from '../../services';
import { Error1, Input, Overlay, Select, DescrInput, Radio } from '../../components/all';

export function InventoryAdd(){
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [categories, setCategories] = useState([]);
  const [descr, setDescr] = useState({ value: '' });
  const [unit, setUnit] = useState({ value: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getCategories();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategories = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
    if(response?.error) setError(response?.error);
    else {
      let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...response?.data];
      setCategories(data);
    }
    setLoading(false);
  }

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError, inRow: true };
  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, inRow: true,
    data: categories, s_value: 'categoryId', s_descr: 'categoryName' };
  const descrProps = { value: descr, setValue: setDescr, label: t('inventory.descr1'), placeholder: t('inventory.descr1'), setError };
  const unitProps = {};

  return (
    <Overlay className='s_container1' loading={loading}>
      {error && <Error1 error={error} />}
      <div className='ac_back'>
        <div className='ac_row'>
          <Input {...nameProps} />
          <div className='gap' />
          <Select {...categoryProps} />
        </div>
        <DescrInput {...descrProps} />
        <Radio {...unitProps} />
      </div>
    </Overlay>
  )
}