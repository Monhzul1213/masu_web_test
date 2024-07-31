import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DynamicAIIcon } from '../../../all';
import { SearchInput } from '../../../invt/inventory/list/SearchInput';
import { Import } from './Import';

export function Search(props){
  const { handleEnter, size, data, setData, newItem, siteId, setTotal, isImport, columns } = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const onClickSearch = () => setShowSearch(!showSearch);

  const changeSearch = value => {
    setSearch(value);
    handleEnter(value);
  }

  const onClickVisible = e => {
    e?.preventDefault();
    setVisible(siteId?.value ? true : false)
  }

  const closeModal = () => {
    setVisible(false);
  }

  const id = size?.width > 780 ? 'ih_large' : 'ih_small';

  const width = showSearch ? 0 : isImport ? 120 : 40;
  const width1 = !showSearch ? 0 : (size?.width > 430 ? 320 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch: changeSearch, width: width1, className: 'po_search_input' };
  const importProps = { className: 'ih_btn', text: t('page.import'), onClick: onClickVisible };
  const modalProps = { visible, closeModal , setVisible, data, setData, newItem, setTotal, columns};

  return (
    <div className='po_search_back' id={id}>
      {visible && <Import {...modalProps}/>}
      <p className='ac_title'>{t('inventory.title')}</p>
      <div className='ac_row_back' style={style}>
        {isImport ? <Button {...importProps}/> : null}
        <div className='po_search_icon'><DynamicAIIcon {...searchProps} /></div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}