import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ButtonRowAdd, DynamicAIIcon , Button } from '../../components/all/all_m';
import { Search } from './Search';
import { ExportExcel } from '../../../helpers';

export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch, size , columns, data, excelName} = props;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEnter = value => {
    onSearch( search, value);
    
  }
  const onClickImport = () => navigate('customer_import');

  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 20));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const id = size?.width > 180 ? 'ih_large' : 'ih_small';

  const onClickSearch = () => setShowSearch(!showSearch);
  const addProps = { type: 'customer', onClickAdd, show, onClickDelete };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show , className: 'rp_list_search_back' };
  const importProps = {  className: 'ih_btn', text: t('page.import'), onClick: onClickImport };
  const exportProps = { text: t('page.export'), columns: columns, excelData: data, fileName: excelName};


  return (
    <div className='rp_list_filter_zz' id={id}  >  
      <div className='ih_header1'>
        <ButtonRowAdd {...addProps} />
        <div className='ih_btn_row' >
          <Button {...importProps} />
          <ExportExcel {...exportProps} />
        </div>
      </div>
      <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
      <Search {...inputProps} />
    </div>
  );
}