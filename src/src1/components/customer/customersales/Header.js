import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { ExportExcel } from '../../../../helpers';
import { DynamicAIIcon } from '../../../../components/all';
import { SearchInput } from '../../../../components/invt/inventory/list/SearchInput';
import { IconSelect, DynamicMDIcon } from '../../../../components/all';
import { Filter } from './Filter';

export default function Header(props){
  const {
    size, onSearch, columns, excelName,
    value, setValue, data, className, data1,
    setError, invt, setInvt, afterFilter,
    hideToolbar = false,
  } = props;

  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const handleEnter = (val) => {
    const query = val ? ('&InvtName=' + encodeURIComponent(val)) : '';
    onSearch && onSearch('', query);
  };

  const onClickSearch = () => setShowSearch(!showSearch);
  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 60));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1, className: 'rp_list_search_back_z' };

  const columnProps = {
    value, setValue, data, className,
    Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] }
  };

  const filterProps = {
    setError,
    size,
    onSearch,
    invt,
    setInvt
  };

  return (
    <>
      <Filter {...filterProps} />
      {afterFilter}
      {!hideToolbar && ( 
       <div className='rp_list_filter_z1'>
         <ExportExcel text={t('page.export')} columns={columns} excelData={data1} fileName={excelName} />
         <div className='rp_list_filter_z'>
           <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
           <SearchInput {...inputProps} />
           <IconSelect {...columnProps} />
         </div>
       </div>
     )}
    </>
  );
}
