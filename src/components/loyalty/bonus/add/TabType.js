import React from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

export function TabType(props){
  const { page, type, setType } = props;
  const { t } = useTranslation();

  return page === 1 && (
    <div>
      <Type title={t('bonus.title0')} label={t('bonus.label0')} value={0} {...props}>

      </Type>
      <Type title={t('bonus.title1')} label={t('bonus.label1')} value={1} {...props}>

      </Type>
      <Type title={t('bonus.title2')} label={t('bonus.label2')} value={2} {...props}>

      </Type>
      <Type title={t('bonus.title3')} label={t('bonus.label3')} value={3} {...props}>

      </Type>
    </div>
  );
}

function Type(props){
  const { title, label, value, type, setType, children } = props;
  const checked = type?.value === value;

  const onChange = () => setType({...type, value: checked ? null : value });

  return (
    <div>
      <div className='bt_header'>
        <div className='bt_header1'>
          <p className='bt_header_title'>{title}</p>
          <p className='bt_header_descr'>{label}</p>
        </div>
        <Switch className='a_item_check' checked={checked} onChange={onChange} />
      </div>
      {children}
    </div>
  );
}