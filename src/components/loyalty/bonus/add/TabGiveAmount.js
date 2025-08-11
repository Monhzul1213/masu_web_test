import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PercentInput } from '../../../../src1/components/all/all_m';
import { Input, MoneyInput, Select } from '../../../all';

export function TabGiveAmount(props){
  const { reward, onChangeText, onChangeNumber, setError1, disabled } = props;
  const { t } = useTranslation();
  const [types] = useState([{ value: 0, label: t('discount.perc') }, { value: 1, label: t('discount.amount') }]);

  return (
    <div>
      <Input
        label={t('bonus.reward_name')}
        placeholder={t('bonus.reward_name')}
        value={{ value: reward?.rewardName }}
        disabled={disabled}
        setError={setError1}
        setValue={value => onChangeText(value, 'rewardName')}
        inRow={true} />
      <Select
        value={{ value: reward?.discountType }}
        setValue={value => onChangeText(value, 'discountType')}
        label={t('bonus.discount_type')}
        disabled={disabled}
        setError={setError1}
        placeholder={t('bonus.discount_type')}
        data={types} />
      {reward?.discountType === 1 ?
        <MoneyInput
          label={t('bonus.discount_value')}
          placeholder={t('bonus.discount_value')}
          disabled={disabled}
          setError={setError1}
          value={{ value: reward?.discountValue }}
          setValue={value => onChangeText(value, 'discountValue')} />
        :
        <PercentInput
          label={t('bonus.discount_value')}
          disabled={disabled}
          placeholder={t('bonus.discount_value')}
          setError={setError1}
          value={{ value: reward?.discountValue }}
          setValue={value => onChangeText(value, 'discountValue')} />
      }
      <Input
        label={t('bonus.earn_point')}
        placeholder={t('bonus.earn_point')}
        disabled={disabled}
        setError={setError1}
        value={{ value: reward?.earnPoint }}
        setValue={value => onChangeNumber(value, 'earnPoint')} />
    </div>
  );
}