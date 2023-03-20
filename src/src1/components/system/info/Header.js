import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { PlainRange , DynamicAIIcon} from '../../../../components/all';
import { Search } from './Search';
export function Header(props){
  const { onSearch, size , show, data , filter} = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [classH, setClassH] = useState('th_header1');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if(size?.width >= 870) setClassH('th_header1');
    else if(size?.width < 870 && size?.width >= 660) setClassH('th_header2');
    else setClassH('th_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const handleEnter = value => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    query += (value ? ('&filter=' + value) : '');
    onSearch && onSearch( query , filter);
  }


  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(search?.length !== 0) data?.forEach(item => {
      query += '&filter=' + item?.customer
    });
    onSearch && onSearch(query, filter, date );
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const width = showSearch ? 0 : 780;
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 20));
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date' };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show , className: 'rp_list_search_back_s' , filter};
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };

  return (
    <div className='rp_list_filter' style={{paddingTop: 0}}>
      <div className={classH} style={{marginTop: 0}}>
        <PlainRange {...dateProps} />
      </div>
      <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div>
      <Search {...inputProps} />
    </div>
  );
}