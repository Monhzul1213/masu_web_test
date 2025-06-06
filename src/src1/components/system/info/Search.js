import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicAIIcon } from '../../all/all_m';

export function Search(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width, className, date } = props;
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    if(showSearch) inputRef?.current?.focus();
    return () => {};
  }, [showSearch])

  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in', height: 40, };

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") handleEnter(search);
  }

  const onChange = e => setSearch(e.target.value);

  const onClose = () => {
    setShowSearch(!showSearch);
    setSearch('');
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    onSearch(query);
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