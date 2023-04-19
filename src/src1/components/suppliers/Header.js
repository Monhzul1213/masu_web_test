import React, { useState } from 'react';
import { ButtonRowAddConfirm, DynamicAIIcon } from '../../components/all/all_m';
import { Search } from '../customer/Search';

export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch, size } = props;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);


  const handleEnter = value => {
    let api = (value ? ('?vendName=' + value) : '');
    onSearch(api);
  }
  const onClickSearch = () => setShowSearch(!showSearch);
  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 20));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const addProps = { type: 'supplier', onClickAdd, show, onClickDelete };
  const searchProps = { className: 'ih_search1', name: 'AiOutlineSearch', onClick: onClickSearch,  };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, onSearch, width: width1, className: 'rp_list_search_back' };

  return (
    <div className='rp_list_filter_zz'>  
      <ButtonRowAddConfirm {...addProps} />
      <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
      <Search {...inputProps} />
    </div>
  );
}