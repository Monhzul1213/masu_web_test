import React from 'react';
import { useTranslation } from 'react-i18next';

import { Type } from './TabType';

export function TabGive(props){
  const { page, reward, setReward } = props;
  const { t } = useTranslation();

  const onChange = (checked, value) => {
    setReward({ value: checked ? null : value });
  }

  return page === 2 && (
    <div>
      <Type title={t('bonus.title0_1')} label={t('bonus.label0_1')} value={0} onChange={onChange} data={reward}>
        {/* <MoneyInput
          label={t('bonus.every_amount')}
          placeholder={t('bonus.every_amount')}
          value={{ value: type?.everyAmount }}
          setValue={value => onChangePrice(value, 'everyAmount')}
          inRow={true} />
        <Input
          label={t('bonus.bonus_point')}
          placeholder={t('bonus.bonus_point')}
          value={{ value: type?.bonusPoint }}
          setValue={value => onChangeNumber(value, 'bonusPoint')} /> */}
      </Type>
      <Type title={t('bonus.title1_1')} label={t('bonus.label1_1')} value={1} onChange={onChange} data={reward}>
      </Type>
      <Type title={t('bonus.title2_1')} label={t('bonus.label2_1')} value={2} onChange={onChange} data={reward}>
      </Type>
      <Type title={t('bonus.title3_1')} label={t('bonus.label3_1')} value={3} onChange={onChange} data={reward}>
      </Type>
    </div>
  );
}