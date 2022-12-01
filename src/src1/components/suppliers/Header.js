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

  const id = size?.width > 440 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 440 ? 217 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 465 ? 250 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const addProps = { type: 'supplier', onClickAdd, show, onClickDelete };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch,  };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show};

  return (
    <div className='ih_header' id={id}>  
      <ButtonRowAddConfirm {...addProps} />
      <div className='ih_header2' style={style}>
        <DynamicAIIcon {...searchProps} />
      </div>
      <Search {...inputProps} />
    </div>
  );
}