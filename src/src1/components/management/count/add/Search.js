import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon, DynamicBSIcon, IconButton } from '../../../all/all_m';
import { SearchInput } from '../../../../../components/invt/inventory/list/SearchInput';
import { Inventory } from './Inventory';

export function Search(props){
  const { handleEnter, size, data, setData, siteId, setSiteId, status} = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const onClickSearch = () => setShowSearch(!showSearch);

  const changeSearch = value => {
    setSearch(value);
    handleEnter(value);
  }

  const onClick = (e) => {
    e?.preventDefault();
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }
  
  
  const id = size?.width > 780 ? 'ih_large' : 'ih_small';

  const width = showSearch ? 0 : 160;
  const width1 = !showSearch ? 0 : (size?.width > 430 ? 320 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch: changeSearch, width: width1, className: 'po_search_input' };
  const addProps = { className: 'po_add_btn', text: t('count.invt_add'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, onClick, disabled: !siteId?.value || status?.value !== 0 ? true : false };
  const modalProps = { visible, closeModal, data , setItem: setData, setVisible, item: data, siteId, setSiteId};

  return (
    <div className='po_search_back' id={id}>
      {visible && <Inventory {...modalProps}/>}
      <p className='ac_title'>{t('inventory.title')}</p>
      <div className='ac_row_back' style={style}>
        <IconButton {...addProps} />
        <div className='po_search_icon'><DynamicAIIcon {...searchProps} /></div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}