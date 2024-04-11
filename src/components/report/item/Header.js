import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { ExportExcel2 } from '../../../helpers';
import { DynamicAIIcon } from '../../all';
import { SearchInput } from '../../invt/inventory/list/SearchInput';
import { IconSelect, DynamicMDIcon } from '../../all';

export function Header(props){
  const { size, onSearch, filter, columns, excelName, value, setValue ,data, className, date, data1 } = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const onClickSearch = () => setShowSearch(!showSearch);

  const handleEnter = value => {
    let query = value ? ('&InvtName=' + value) : '';
    onSearch && onSearch(filter, query, date);
  }

  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 60));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1, className: 'rp_list_search_back_z' };
  const columnProps ={ value , setValue, data , className, Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] }}
  
  return (
    <div className='rp_list_filter_z1'>
        <ExportExcel2 text={t('page.export')} columns={columns} excelData={data1} fileName={excelName} />
        <div className='rp_list_filter_z'>
          <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
          <SearchInput {...inputProps} />
          <IconSelect {...columnProps} />
        </div>
    </div>
  );
}