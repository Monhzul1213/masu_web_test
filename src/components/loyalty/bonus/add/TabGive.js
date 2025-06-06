import React from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '../../../all';
import { TabGiveAmount } from './TabGiveAmount';
import { TabGiveCategory } from './TabGiveCategory';
import { TabGiveItems } from './TabGiveItems';
import { TabGiveItems1 } from './TabGiveItems1';
import { Type } from './TabType';

export function TabGive(props){
  const { page, reward, setReward, setRewardItems, setError, setError1, disabled } = props;
  const { t } = useTranslation();

  const onChange = (checked, value) => {
    setReward({ value: checked ? null : value, id: reward?.id, rewardName: reward?.rewardName, categoryId: null, discountType: 0, discountValue: '', earnPoint: '' });
    setRewardItems([]);
    setError(null);
    setError1(null);
  }

  const onChangeText = (value, field) => {
    if(field !== 'discountType') setReward({...reward, [field]: value?.value });
    else setReward({...reward, [field]: value?.value, discountValue: '' });
  }

  const onChangeNumber = (value, field) => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(!isNaN(text)) setReward({...reward, [field]: text });
  } 

  const typeProps = { onChange, data: reward, disabled };

  return page === 2 && (
    <div>
      <Type title={t('bonus.title0_1')} label={t('bonus.label0_1')} value={0} {...typeProps}>
        <Input
          label={t('bonus.reward_name')}
          placeholder={t('bonus.reward_name')}
          value={{ value: reward?.rewardName }}
          setValue={value => onChangeText(value, 'rewardName')}
          setError={setError1}
          disabled={disabled}
          inRow={true} />
        <div className='gap' />
        <TabGiveItems {...props} setError={setError1} />
      </Type>
      <Type title={t('bonus.title1_1')} label={t('bonus.label1_1')} value={1} {...typeProps}>
        <Input
          label={t('bonus.reward_name')}
          placeholder={t('bonus.reward_name')}
          value={{ value: reward?.rewardName }}
          setValue={value => onChangeText(value, 'rewardName')}
          setError={setError1}
          disabled={disabled}
          inRow={true} />
        <div className='gap' />
        <TabGiveItems1 {...props} setError={setError1} />
      </Type>
      <Type title={t('bonus.title2_1')} label={t('bonus.label2_1')} value={2} {...typeProps}>
        <TabGiveCategory {...props} onChangeText={onChangeText} onChangeNumber={onChangeNumber} setError1={setError1} />
      </Type>
      <Type title={t('bonus.title3_1')} label={t('bonus.label3_1')} value={3} {...typeProps}>
        <TabGiveAmount {...props} onChangeText={onChangeText} onChangeNumber={onChangeNumber} setError1={setError1} />
      </Type>
    </div>
  );
}