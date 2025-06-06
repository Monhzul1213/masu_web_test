import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DynamicAIIcon } from '../../../all';
import { SearchInput } from '../../../invt/inventory/list/SearchInput';

export function Search(props){
  const { handleEnter, onClickAll, size } = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const onClickSearch = () => setShowSearch(!showSearch);

  const changeSearch = value => {
    setSearch(value);
    handleEnter(value);
  }

  const width = showSearch ? 0 : 40;
  const width1 = !showSearch ? 0 : (size?.width > 430 ? 320 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch: changeSearch, width: width1, className: 'po_search_input' };

  return (
    <div className='po_search_back'>
      <p className='ac_title' style={{flex: 1}}>{t('inventory.title')}</p>
      <Button className='pr_all_btn' text={t('order.receipt_all')} onClick={onClickAll} />
      <div className='po_search_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
      <SearchInput {...inputProps} />
    </div>
  );
}