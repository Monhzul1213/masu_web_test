import React, { useState } from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import { Pagination } from '../../../all';

export function CardModifier(props){
  const { t } = useTranslation();
  const { data, setData, setEdited } = props;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const onChange = (item, value) => {

  }

  const renderItem = (item, index) => {
    return (
      <div className='a_item' key={index}>
        <div className='a_item_text'>
          <p className='a_item_title'>{item?.modiferName}</p>
          <p className='a_item_sub_title'>{item?.optionName}</p>
        </div>
        <Switch className='a_item_check' checked={item?.checked} onChange={e => onChange(item, e)} />
      </div>
    )
  }

  const pageProps = { total: data?.length, setStart, setEnd };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';

  return (
    <div className='ac_back'>
      <p className='ac_title'>{t('modifier.title')}</p>
      <div className='list_back' id='paging' style={{ maxHeight, marginTop: 15 }}>
        {data?.slice(start, end)?.map(renderItem)}
      </div>
      <Pagination {...pageProps} />
    </div>
  );
}