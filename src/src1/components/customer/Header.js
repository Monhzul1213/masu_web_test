import React, { useState } from 'react';
import { ButtonRowAdd, DynamicAIIcon , Button } from '../../components/all/all_m';
import { Search } from './Search';
import { useTranslation } from 'react-i18next';
export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch, size } = props;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { t } = useTranslation();

  const handleEnter = value => {
    onSearch( search, value);
    
  }
  const id = size?.width > 440 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 440 ? 217 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 465 ? 250 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const onClickSearch = () => setShowSearch(!showSearch);
  const addProps = { type: 'customer', onClickAdd, show, onClickDelete };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show};
  const importProps = { className: 'ih_btn_z', text: t('page.import'), disabled: true };
  const exportProps = { className: 'ih_btn_z', text: t('page.export'), disabled: true };


  return (
    <div className='ih_header' id={id} >  
      <div className='ih_header1'>
        <ButtonRowAdd {...addProps} />
        <div className='ih_btn_row_z'  style={{display: 'none'}}>
          <Button {...importProps} />
          <Button {...exportProps} />
        </div>
      </div>
      <div className='ih_header2' style={style} >
        <DynamicAIIcon {...searchProps} />
      </div>
      <Search {...inputProps} />
    </div>
  );
}