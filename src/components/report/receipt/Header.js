import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { ExportExcel2 } from '../../../helpers';
import { DynamicAIIcon } from '../../all';
import { SearchInput } from '../../invt/inventory/list/SearchInput';

export function Header(props){
  const { size, onSearch, filter, columns, data, excelName } = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const onClickSearch = () => setShowSearch(!showSearch);

  const handleEnter = value => {
    let query = value ? ('&Name=' + value) : '';
    onSearch && onSearch(filter, query);
  }

  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 60));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1, className: 'rp_list_search_back' };

  return (
    <div className='rp_list_filter'>
      <ExportExcel2 text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
      <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
      <SearchInput {...inputProps} />
    </div>
  );
}