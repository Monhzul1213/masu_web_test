import React from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import { DynamicMDIcon } from '../../../all';
import { Item } from './Item';

export function List(props){
  const { type, value, setValue, data, setData, disabled } = props;
  const { t } = useTranslation();

  const onChange = checked => setValue(checked ? 'Y' : 'N');

  const onCheck = i => {
    setData(old => old.map((row, index) => {
      if(index === i) return { ...old[i], checked: !row?.checked };
      else return row;
    }));
  }

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, index, onCheck, disabled };
    return (<Item {...itemProps} />);
  }

  return (
    <div className='role_add_back'>
      <div className='role_header'>
        <DynamicMDIcon className='role_header_icon' name={t('role.' + type + '.icon')} />
        <div className='role_header_side'>
          <p className='role_header_title'>{t('role.' + type + '.title')}</p>
          <p className='role_header_descr'>{t('role.' + type + '.descr')}</p>
        </div>
        <Switch className='a_item_check' checked={value === 'Y'} onChange={onChange} disabled={disabled} />
      </div>
      {value === 'Y' && <div style={{marginTop: 10}}>{data?.map(renderItem)}</div>}
    </div>
  );
}