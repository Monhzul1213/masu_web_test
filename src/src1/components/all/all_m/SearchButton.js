import React, {useEffect} from 'react';

import { DynamicAIIcon } from './DynamicIcon';

export function SearchButton(props){
  const { onClickAdd, } = props;


  return (
    <>
      
      <button className='icon_btn' onClick={() => onClickAdd()} >
        <DynamicAIIcon className='search_icon' name='AiOutlineSearch' />
      </button>
    </>
  )
}