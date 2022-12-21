import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { withSize } from 'react-sizeme';

import { getList, sendRequest } from '../../services';
import { Error1, Overlay, Prompt, ButtonRowConfirm } from '../../components/all';
import { Main, List } from '../../components/config/tax/add';
import { CardEmpty } from '../../components/invt/inventory/add';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [notes, setNotes] = useState({ value: '' });
  const [checked, setChecked] = useState(false);
  const [sites, setSites] = useState([]);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [request, setRequest] = useState(null);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  const getData = async () => {
    let requestId = searchParams?.get('requestId');
    let response = await getSites();
    if(response && (requestId || requestId === 0)) await getRequest(requestId, response);
  }

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      setSites(response?.data);
      return response?.data;
    }
  }

  const getRequest = async (requestId, siteRes) => {
    setShow(false);
    setRequest(null);
    // setError(null);
    // setLoading(true);
    // let response = await dispatch(getList(user, token, 'Inventory/GetModifer/ModifireID', null, { modifireid }));
    // setLoading(false);
    // if(response?.error) setError(response?.error);
    // else {
    //   setItem(response?.data);
    //   setName({ value: response?.data?.modifer?.modiferName ?? '' });
    //   response?.data?.modiferItems?.forEach(item => item.rowStatus = 'U');
    //   setItems(response?.data?.modiferItems);
    //   siteRes?.forEach(item => {
    //     let exists = response?.data?.modiferSites?.filter(si => si.siteId === item.siteId)[0];
    //     item.checked = exists?.useModifier === 'Y';
    //     if(exists) item.rowStatus = 'U';
    //   });
    //   setSites(siteRes);
    //   setChecked(response?.data?.modifer?.useAllSite === 'Y');
    // }
  }

  const onClickCancel = () => navigate('/config/tax');

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

  const validateData = () => {
    let items = sites?.filter(item => item.hasLocation);
    if(regNo?.value && name?.value && items?.length){
      let vatRequestItem = items?.map(item => {
        let newItem = {
          siteId: item?.siteId, district: item?.descr,
          locationX: item?.locationX + '', locationY: item?.locationY + '',
          poscount: item?.posQty, rowStatus: item?.rowStatus ?? 'I'
        };
        return newItem
      });

      let data = {
        reqeustId: request?.reqeustId ?? -1,
        vatPayerNo: regNo?.value, vatPayerName: name?.value, isVat: checked ? 1 : 0,
        vatPayerPhone: '', status: 0, descr: notes?.value,
        rowStatus: request ? 'U' : 'I',
        vatRequestItem
      };
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!items?.length) setError(t('tax.length_error'));
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      console.log(data);
      onLoad();
      let response = await dispatch(sendRequest(user, token, 'Merchant/VatRequest', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('tax.add_success'));
    }
  }

  const onClickDelete = async () => {
    /**
      onLoad();
      item.modifer.rowStatus = 'D';
      item.modiferSites.forEach(sit => sit.rowStatus = 'U');
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', [item]));
      if(response?.error) onError(response?.error);
      else onSuccess(t('modifier.delete_success'));
     */
  }

  const width = size?.width >= 690 ? 690 : size?.width;
  const mainProps = { setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes, setNotes };
  const siteProps = { data: sites, setData: setSites, setEdited, setError };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add', id: 'add_back' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show, id: 'add_btns' };

  return (
    <div className='add_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        <Prompt edited={edited} />
        {error && <Error1 error={error} />}
        <div className='i_scroll'>
          <form style={{ width }}>
            <Main {...mainProps} />
            <div className='gap' />
            {sites?.length ? <List {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
          </form>
        </div>
        <div style={{ width }}><ButtonRowConfirm {...btnProps} /></div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const TaxAdd = withSizeHOC(Screen);