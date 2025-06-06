import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { Input, Select } from '../../../all';

export function TabTypeCategory(props){
  const { type, setType, onChangeNumber, setError1, disabled } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocus = async () => {
    if(!categories?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else setCategories(response?.data);
      setLoading(false);
    }
  }

  return (
    <div>
      <Select
        value={{ value: type?.categoryId, error }}
        setValue={value => setType({...type, categoryId: value?.value })}
        label={t('bonus.category1')}
        placeholder={t('bonus.category1')}
        inRow={true}
        data={categories}
        setError={setError1}
        disabled={disabled}
        s_value='categoryId'
        s_descr='categoryName'
        loading={loading}
        onFocus={onFocus} />
      <Input
        label={t('bonus.bonus_point')}
        placeholder={t('bonus.bonus_point')}
        disabled={disabled}
        setError={setError1}
        value={{ value: type?.bonusPoint }}
        setValue={value => onChangeNumber(value, 'bonusPoint')} />
    </div>
  );
}