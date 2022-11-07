import React from 'react';
import { DynamicAIIcon } from '../../../all';

export function SearchInput(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch } = props;

  return (
    <div className='ih_search_back'>
      <DynamicAIIcon className='ih_input_icon' name='AiOutlineSearch' />
    </div>
  )
}