import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from '../../all/all_m';

export function Search(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch, width, className } = props;
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    if(showSearch) inputRef?.current?.focus();
    return () => {};
  }, [showSearch])

  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in', height: 40, };

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      e?.preventDefault();
      handleEnter && handleEnter(search);
    }
  }

  const onChange = e => setSearch(e.target.value);

  const onClose = () => {
    setShowSearch(!showSearch);
    setSearch('');
    handleEnter && handleEnter('')
    // onSearch('');
  }

  return (
    <div className={className ?? 'ih_search_back'} style={style}>
      <DynamicAIIcon className='ih_input_icon_z' name='AiOutlineSearch' />
      <input
        className='ih_input_z'
        ref={inputRef}
        onKeyDown={onKeyDown}
        placeholder={t('customer.search')}
        value={search}
        onChange={onChange} />
      <DynamicAIIcon className='ih_input_close_z' name='AiFillCloseCircle' onClick={onClose} />
    </div>
  )
}