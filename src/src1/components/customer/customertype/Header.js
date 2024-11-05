import React, { useEffect, useState } from 'react';

import { DynamicAIIcon } from '../../all/all_m'
import { Search } from '../customer/Search';

export function Header(props){
  const {show, onSearch, size } = props;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleEnter = (value) => {
    let query = value ? '?TypeName=' + value : '';
    onSearch( query);
  }

  const width = showSearch ? 0 : (size?.width > 780 ? 620 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 20));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const id = size?.width > 400 ? 'ih_large' : 'ih_small';

  const onClickSearch = () => setShowSearch(!showSearch);
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show , className: 'rp_list_search_back1' };

  return (
    <div className='ih_header' id={id}  >  
      <div className={'ih_header2'} style={style}>
          <DynamicAIIcon {...searchProps} style={{marginTop: 17}}/>
      </div>
      <Search {...inputProps} />
    </div>
  );
}