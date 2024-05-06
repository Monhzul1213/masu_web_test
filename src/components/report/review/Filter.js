import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import 'antd/dist/antd.css';
import moment from 'moment';
import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect } from '../../all';

export function Filter(props) {
  const { setError, size, onSearch, filter1 } = props;
  const [date, setDate] = useState([moment(), moment()]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [Custs, setCusts] = useState([]);
  const [Cust, setCust] = useState([]); 
  const [classH, setClassH] = useState('rp_h_back1');
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(loading)
    onFocusCust();
    return () => { };
  }, []);

  useEffect(() => {
    if (size?.width >= 920) setClassH('rp_h_back1');
    else if (size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onFocusCust = async () => {
    if(!Custs?.length){
      setError && setError(null);
      setLoading('custs');
      let headers = {CustID: -1}
      const response = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
      console.log(response)
      if(response?.error) setError && setError(response?.error);
      else {
        setCusts(response?.data?.customers);
        setCust(response?.data?.customers?.map(item => item?.custId));
      }
      setLoading(false);
    }
  }

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if (Cust?.length !== Custs?.length) Cust?.forEach(item => query += '&custId=' + item);
    console.log(query)
    onSearch && onSearch(query, filter1, date);
  }

  const onOpenChange = show => {
    if (!show) onHide(); 
  };

  const maxCust = Cust?.length === Custs?.length ? t('time.all_cust') : (Cust?.length + t('time.some_cust'));
  const custProps = { value: Cust, setValue: setCust, data: Custs, s_value: 'custId', s_descr: 'custName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rp_select_back1',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusCust, loading: loading === 'custs', maxTag: maxCust, placeholder: t('time.all_cust') };
  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date'}
  return ( 
      <div className='rp_h_back1'>
        <MonthRange {...dateProps}/>
      <MultiSelect {...custProps} />
      </div>
  );
}