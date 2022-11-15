import React, { useState } from 'react';
import { ButtonRowAdd, DynamicAIIcon } from '../../components/all/all_m';
import { Search } from './Search';

export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch,  } = props;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleEnter = value => {
    onSearch( search, value);
    
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const addProps = { type: 'customer', onClickAdd, show, onClickDelete };
  const style = { width: showSearch ? 0 : 440, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch};

  return (
    <div className='i_list_header_z'>  
      <ButtonRowAdd {...addProps} />
      <div className='i_list_header1_z' style={style}>
        <DynamicAIIcon {...searchProps} />
      </div>
      <Search {...inputProps} />
    </div>
  );
}