import React from 'react';
import { DynamicAIIcon } from '../../../all';

export function SearchInput(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch } = props;

  // const style = { opacity: !showSearch ? "0" : "1", transition: "opacity .2s ease-in", display: showSearch ? 'flex' : 'none', transition: "display .5s", };
  const style = { width: showSearch ? null : 0, overflow: 'hidden', transition: 'width 0.5s ease-in' };

  return (
    <div className='ih_search_back' style={style}>
      <DynamicAIIcon className='ih_input_icon' name='AiOutlineSearch' onClick={() => setShowSearch(!showSearch)} />
    </div>
  )
}