import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { ButtonRowAddConfirm, DynamicAIIcon, PlainRange, PlainSelect } from '../../../all/all_m';
import { SearchInput } from '../../../../../components/invt/inventory/list/SearchInput';

export function Filter(props){
  const { size, onClickAdd, onSearch } = props;
  const { t } = useTranslation();
  const [classH, setClassH] = useState('th_header1');
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [status, setStatus] = useState(-1);
  const [states, setStates] = useState([{valueNum: -1, valueStr1: t('order.all_status')}]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if(size?.width >= 870) setClassH('th_header1');
    else if(size?.width < 870 && size?.width >= 660) setClassH('th_header2');
    else setClassH('th_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { valueNum: -1, valueStr1: t('order.all_status') },
        { valueNum: 1, valueStr1: 'Идэвхитэй' },
        { valueNum: 0, valueStr1: 'Хүчингүй' },
      ]);
    }
  }

  const onHide = (status, name) => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(status !== -1) query += '&Status=' + status;
    query += name ? '&Name=' + name : '';
    onSearch(query);
  }

  const onChangeStatus = value => {
    setStatus(value);
    onHide(value, search);
  }

  const handleEnter = value => {
    onHide( status, value);
  }

  const id = size?.width > 780 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 780 ? 462 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 412 : (size?.width - 30));
  const classBack = 'cou_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const onClickSearch = () => setShowSearch(!showSearch);
  const addProps = { type: 'coupon', onClickAdd, show: false };
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), 
    onHide: () => onHide(status), className: 'rh_date'};
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'valueNum', s_descr: 'valueStr1',
    label: t('order.status'), onFocus: onFocusStatus, classBack, classLabel, className, bStyle };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };

  return (
    <div className='ih_header' id={id}>
      <ButtonRowAddConfirm {...addProps} />
      <div className={classH} style={style}>
        <PlainRange {...dateProps} />
        <div className='th_header_s' >
          <PlainSelect {...statProps} />
          <DynamicAIIcon {...searchProps} style={{marginTop: 15}}/>
        </div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}