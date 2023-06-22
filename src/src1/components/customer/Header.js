import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonRowAdd, DynamicAIIcon , Button } from '../../components/all/all_m';
import { Search } from './Search';

export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch, size } = props;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { t } = useTranslation();

  const handleEnter = value => {
    onSearch( search, value);
    
  }
  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 20));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const onClickSearch = () => setShowSearch(!showSearch);
  const addProps = { type: 'customer', onClickAdd, show, onClickDelete };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show , className: 'rp_list_search_back' };
  const importProps = { className: 'ih_btn_z', text: t('page.import'), disabled: true };
  const exportProps = { className: 'ih_btn_z', text: t('page.export'), disabled: true };


  return (
    <div className='rp_list_filter_zz'  >  
      <div className='ih_header1'>
        <ButtonRowAdd {...addProps} />
        <div className='ih_btn_row_z'  style={{display: 'none'}}>
          <Button {...importProps} />
          <Button {...exportProps} />
        </div>
      </div>
      <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
      <Search {...inputProps} />
    </div>
  );
}