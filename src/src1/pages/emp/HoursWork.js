import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {  Confirm, Error1, Overlay } from '../../components/all/all_m';
import { List } from '../../components/invt/discount';
import { useDispatch, useSelector, } from 'react-redux';
import { getList } from '../../services';
import '../../css/hours.css'
import { Header } from '../../components/emp/hourswork';
export function HoursWork(){

  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
 const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [filter,  setFilter] =   useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user , token }  = useSelector(state => state.login);

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getData = async query => {
    setError(null);
    setLoading(true);
    // let api = 'Site/GetDiscount' + (query ?? '');
    // const response = await dispatch(getList(user, token, api));
    // console.log(response)
    // if(response?.error) setError(response?.error);
    // else setData(response?.data);
    setLoading(false);
    setShow(false);
    setChecked(false);
    setFiltering(query ? true : false);
    setFilter(query);
  }
  


  const confirm = async sure => {
    setOpen(false);
    if(sure){
      
    }
  };

  const siteProps = {getData};
  const listProps = { data, setData, setShow, checked, setChecked };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='s_container'>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading === 'loading'}>
        {error && <Error1 error={error} />}
        <Header {...siteProps}/>
        <List {...listProps} />
      </Overlay>
    </div>
  )
}