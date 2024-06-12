import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckAll, ButtonRowAdd, Confirm, Pagination, Overlay } from '../../all';
import { Item } from './Item';

export function List(props){
  const { onClickAdd, onDelete, data, show, setShow, checked, setChecked, selected, setSelected, setData} = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [loading, setLoading] = useState(false);

  const onClickDelete = () => setOpen(true);

  const confirm = sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      (Object.keys(selected))?.map(item => toDelete?.push({ categoryID: parseInt(item) }));
      onDelete(toDelete);
    }
  };
  
  const onCheckAll = checked => {
    setShow(checked);
    setChecked(checked);
    if(checked){
      let selected = {};
      data?.map(item => selected[item?.categoryId] = true);
      setSelected(selected);
    } else
      setSelected({});
  }

  const onCheck = (category, checked) => {
    let newSelected = {...selected};
    if(checked){
      delete newSelected[category];
      setChecked(false);
      if(!(Object.keys(newSelected))?.length) setShow(false);
    } else {
      newSelected[category] = true;
      setShow(true);
    }
    setSelected(newSelected);
  }

  const addProps = { type: 'category', onClickAdd, show, onClickDelete };
  const checkProps = { type: 'category', checked, onCheckAll };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };
  const pageProps = { total: data?.length, setStart, setEnd, size: 25 };
  const itemProps = {lbl: t('category.item'), onCheck, onClick: onClickAdd, data: data?.slice(start, end), setData, selected, loading, setLoading};
  
  return (
    <Overlay loading={loading}>
      <div className='ca_list'>
        {open && <Confirm {...confirmProps} />}
        <ButtonRowAdd {...addProps} />
        <div style={{height: 20}} />
        <CheckAll {...checkProps} />
        <div className='list_back' id='paging'>
          <Item {...itemProps} />
        </div>
        <Pagination {...pageProps} />
      </div>
    </Overlay>
  )
}