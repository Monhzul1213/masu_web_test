import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import { getList, sendRequest } from '../../../services';
import '../../css/discount.css';
import { ButtonRowConfirm, Error1, Overlay , Prompt } from '../../components/all/all_m';
import { Add , Site, CardEmpty} from '../../components/loyalty/discount';

export function DiscountAdd(){
  const [name, setName] = useState({ value: '' });
  const [price, setPrice] = useState({ value: '' });
  const [perc, setPerc] = useState({ value: '' });
  const [isEach, setIsEach] = useState({ value: '0' });
  const [isCheck, setIsCheck] = useState(false);
  const [sites, setSites] = useState([]);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState(true);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    getSites();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        item.checked = true;
        item.rowStatus = 'I';
      });
      setSites(response?.data);
      return response?.data;
    }
  }
  const getData = async () => {
    let discountId = searchParams?.get('discountId');
    let response = await getSites();
    if(response && (discountId || discountId === 0)) await GetDiscount(discountId, response);
  }
  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  }

  const onError = err => {
    setError(err);
    setEdited(true);
    setLoading(false);
  }

  const onSuccess = msg => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  }

  const onClickCancel = () => 
    navigate('/inventory/invt_discount');
 


  
  const GetDiscount = async (discountId, site, ) => {
    setError(null);
    setLoading(true);
    let api = '?discountId=' + discountId
    let response = await dispatch(getList(user, token, 'Site/GetDiscount'+ api,   ));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      let dis = response && response?.data && response?.data[0];
      setSelected(dis)
      setItem(response?.data);
      setName({ value: dis?.discountName ?? '' });
      setIsEach({ value: dis?.discountType.toString() ?? '0' });
      setPrice({ value: dis?.discountValue ?? '' });
      setPerc({ value: dis?.discountValue.toString() ?? ''  });
      setIsCheck( dis?.isRestrictedAccess === 'Y' );
      response?.data?.forEach(item => item.rowStatus = 'U');
      site?.forEach(item => {
        let exists = dis?.sites?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists; 
        if(exists) item.rowStatus = 'U';
      });
      setSites(site);
    }
  }
const onClickSave = async () => {
    let nameLength= 2;
    let price1 = (isEach?.value === '1') ? price?.value : perc?.value
    let isNameValid = name?.value?.trim() && name?.value?.length >= nameLength;
    if(isNameValid && price1 ){
      onLoad();
    let discountSite=[];
    sites?.forEach(item => {
      if(item?.checked) discountSite.push({ siteID: item?.siteId, rowStatus: item?.rowStatus ?? 'I' });
      else if(item?.rowStatus === 'U') discountSite.push({ siteID: item?.siteId, rowStatus: 'D' });
    });
     let data = 
    [ {
      discountId: selected ? selected?.discountId : -1,
      discountName: name?.value,
      discountType: isEach?.value,
      discountValue: (isEach?.value === '1') ? price?.value : perc?.value?.replace(/-/g, '0'),
      isRestrictedAccess: isCheck ? 'Y' : 'N',
      rowStatus: selected ? "U": "I",
      discountSite
    }]
      const response = await dispatch(sendRequest(user, token, 'Site/AddDiscount', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('discount.add_success'));
    } 
    else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!price1) setPerc({ value: perc?.value, error: t('error.not_empty') });
      if(!price1) setPrice({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') })
    }
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [{...selected, rowStatus: 'D', discountSite: []}];
    const response = await dispatch(sendRequest(user, token, 'Site/AddDiscount', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('employee.delete_success'), true);
  }
  
  const mainProps = { setError, name, setName, isEach, setIsEach, price, setPrice, perc, setPerc, setEdited,  setIsCheck, isCheck };
  const siteProps = {  data: sites, setData: setSites, setEdited, checked, setChecked  };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true:  false , id: 'mo_ac_btn_z'  };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add', id: 'mo_ac_back' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form className='form2'>
          <Add {...mainProps}/>
          <div className='gap' />
          {sites?.length ? <Site {...siteProps} />  : <CardEmpty  {...siteEmptyProps}/>}
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  )
}