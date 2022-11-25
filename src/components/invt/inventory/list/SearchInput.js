import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from '../../../all';

export function SearchInput(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch, width } = props;
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    if(showSearch) inputRef?.current?.focus();
    return () => {};
  }, [showSearch])

  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in', height: 40 };

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") handleEnter(search);
  }

  const onChange = e => setSearch(e.target.value);

  const onClose = () => {
    setShowSearch(!showSearch);
    setSearch('');
    handleEnter('');
  }

  return (
    <div className='ih_search_back' style={style}>
      <DynamicAIIcon className='ih_input_icon' name='AiOutlineSearch' />
      <input
        className='ih_input'
        ref={inputRef}
        onKeyDown={onKeyDown}
        placeholder={t('page.search')}
        value={search}
        onChange={onChange} />
      <DynamicAIIcon className='ih_input_close' name='AiFillCloseCircle' onClick={onClose} />
    </div>
  )
}