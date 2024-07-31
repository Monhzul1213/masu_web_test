import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect } from '../../../components/all';

export function Filter(props){
  const { setError, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment(), moment()]);
  const [custs, setCusts] = useState([]);
  const [cust, setCust] = useState([]);
  // const [classH, setClassH] = useState('rp_h_back1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusCust();
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(cust?.length !== custs?.length) cust?.forEach(item => query += '&CustID=' + item);
    onSearch && onSearch(query, filter1, date);
}

  const onFocusCust = async () => {
    if(!custs?.length){
      setError && setError(null);
      setLoading('custs');
      let headers = {CustID: -1}
      const response = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
      if(response?.error) setError && setError(response?.error);
      else {
        setCusts(response?.data?.customers);
        setCust(response?.data?.customers?.map(item => item?.custId));
      }
      setLoading(false);
    }
  }
  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const maxCust = cust?.length === custs?.length ? t('receive.all_cust') : (cust?.length + t('receive.some_cust'));
  const custProps = { value: cust, setValue: setCust, data: custs, s_value: 'custId', s_descr: 'custName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rp_select_back1',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusCust, loading: loading === 'custs', maxTag: maxCust, placeholder: t('receive.all_cust') };
  

  return (
    <div className={'rp_h_back1'}>
        <MonthRange {...dateProps} />
        <MultiSelect {...custProps} />
    </div>
  );
}
