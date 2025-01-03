import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MonthRange, PlainSelect } from '../../../../../components/all';

export function Filter(props){
  const { size, onSearch, date, setDate, type, setType } = props;
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [classH, setClassH] = useState('rp_h_back1');

  useEffect(() => {
    onFocusType();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 920) setClassH('rp_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = (value) => {
    let query = {
      storedName: value, moduleID: "IN",
      business: [
        {fieldName: "BeginDate", value: date[0]?.format('yyyy.MM.DD')},
        {fieldName: "EndDate", value: date[1]?.format('yyyy.MM.DD')}
      ]
    };
    onSearch && onSearch(query);
  };

  const onFocusType = async () => {
    if(!types?.length || types?.length === 1){
      setTypes([
        { value: 'uspgl_JournalBalanceReport', label: 'Гүйлгээ баланс' },
        { value: 'uspgl_Report_AccountStatement', label: 'Дансны хуулга' },
        { value: 'uspgl_ReportGLJournal', label: 'Ерөнхий дэвтэр' },
        { value: 'uspgl_ReportJournalList', label: 'Ерөнхий журнал' },
        { value: 'uspgl_WorkSheet', label: 'Ажлын хүснэгт' }
      ]);
    }
  };

  const onChangeType = value => {
    setType(value);
    onHide(value);
  };

  const dateProps = { value: date, setValue: setDate, onHide: () => onHide(type), classBack: 'rp_date_back', className: 'rp_date' };

  const typeProps = { value: type, setValue: onChangeType, data: types, s_value: 'value', s_descr: 'label', classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [0, 5] },
    onFocus: onFocusType, placeholder: t('time.select_shop') };
  
  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
        <PlainSelect {...typeProps} />
      </div>
    </div>
  );
}