import React from 'react';
import { DynamicAIIcon } from '../../../all';

export function SearchInput(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch } = props;

  const style = { width: showSearch ? 440 : 0, overflow: 'hidden', transition: 'width 0.2s ease-in', height: 52 };

  return (
    <div className='ih_search_back' style={style}>
      <DynamicAIIcon className='ih_input_icon' name='AiOutlineSearch' onClick={() => setShowSearch(!showSearch)} />
    </div>
  )
}