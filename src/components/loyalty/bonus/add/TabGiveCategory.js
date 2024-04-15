import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { PercentInput } from '../../../../src1/components/all/all_m';
import { Input, MoneyInput, Select } from '../../../all';

export function TabGiveCategory(props){
  const { reward, onChangeText, onChangeNumber, setError1 } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [types] = useState([{ value: 0, label: t('discount.perc') }, { value: 1, label: t('discount.amount') }]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

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
      <Input
        label={t('bonus.reward_name')}
        placeholder={t('bonus.reward_name')}
        setError={setError1}
        value={{ value: reward?.rewardName }}
        setValue={value => onChangeText(value, 'rewardName')}
        inRow={true} />
      <Select
        value={{ value: reward?.categoryId, error }}
        setValue={value => onChangeText(value, 'categoryId')}
        label={t('bonus.reward_category')}
        placeholder={t('bonus.reward_category')}
        data={categories}
        s_value='categoryId'
        s_descr='categoryName'
        loading={loading}
        setError={setError1}
        onFocus={onFocus} />
      <Select
        value={{ value: reward?.discountType }}
        setValue={value => onChangeText(value, 'discountType')}
        label={t('bonus.discount_type')}
        placeholder={t('bonus.discount_type')}
        setError={setError1}
        data={types} />
      {reward?.discountType === 1 ?
        <MoneyInput
          label={t('bonus.discount_value')}
          placeholder={t('bonus.discount_value')}
          setError={setError1}
          value={{ value: reward?.discountValue }}
          setValue={value => onChangeText(value, 'discountValue')} />
        :
        <PercentInput
          label={t('bonus.discount_value')}
          placeholder={t('bonus.discount_value')}
          setError={setError1}
          value={{ value: reward?.discountValue }}
          setValue={value => onChangeText(value, 'discountValue')} />
      }
      <Input
        label={t('bonus.earn_point')}
        placeholder={t('bonus.earn_point')}
        setError={setError1}
        value={{ value: reward?.earnPoint }}
        setValue={value => onChangeNumber(value, 'earnPoint')} />
    </div>
  );
}