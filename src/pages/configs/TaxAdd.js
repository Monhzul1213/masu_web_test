import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { withSize } from 'react-sizeme';

import { getList, sendRequest } from '../../services';
import { Error1, Overlay, Prompt, ButtonRowCancel } from '../../components/all';
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
    if(requestId || requestId === 0) getRequest(requestId);
    else getSites();
  }

  const getSites = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/VatRequest/GetVatRequest?ReqeustId=-2'));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      response?.data?.poscount?.forEach(item => item.district = item.descr ?? '');
      setSites(response?.data?.poscount);
    }
  }

  const getRequest = async requestId => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/VatRequest/GetVatRequest?ReqeustId=' + requestId));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      let request = response?.data?.vatrequest && response?.data?.vatrequest[0];
      setRegNo({ value: request?.vatPayerNo });
      setName({ value: request?.vatPayerName });
      setChecked((request?.isVat + '') === '1');
      setNotes({ value: request?.descr });
      setRequest(request);
      setShow(request?.status + '' === '1');
      let items = request?.items?.map(item => {
        item.hasLocation = true;
        item.coordinate = item.locationY + '\n' + item.locationX;
        item.rowStatus = 'U';
        item.posCount = item.poscount;
        return item;
      });
      response?.data?.poscount?.forEach(pos => {
        let index = items?.findIndex(item => item.siteId === pos.siteID);
        if(index === -1){
          items.push(pos);
        } else {
          items[index].name = pos.name;
        }
      });
      setSites(items);
    }
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
    let length = sites?.filter(item => item.hasLocation)?.length;
    if(regNo?.value && name?.value && length){
      let items = sites?.filter(item => item.hasLocation || item.rowStatus === 'D');
      let vatRequestItem = items?.map(item => {
        let newItem = {
          siteId: item?.siteId ?? item?.siteID, district: item?.district ?? '',
          locationX: item?.locationX + '', locationY: item?.locationY + '',
          poscount: item?.posCount, rowStatus: item?.rowStatus ?? 'I'
        };
        return newItem
      });

      let data = {
        reqeustId: request?.requestId ?? -1,
        requestId: request?.requestId ?? -1,
        vatPayerNo: regNo?.value, vatPayerName: name?.value, isVat: checked ? 1 : 0,
        vatPayerPhone: '', status: 1, descr: notes?.value,
        rowStatus: request ? 'U' : 'I',
        vatRequestItem
      };
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!length) setError(t('tax.length_error'));
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      onLoad();
      let response = await dispatch(sendRequest(user, token, 'Merchant/VatRequest', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('tax.add_success'));
    }
  }

  const onClickDelete = async () => {
    onLoad();
    request.isVat = parseInt(request.isVat);
    request.rowStatus = 'U';
    request.status = 0;
    request.vatRequestItem = request?.items;
    let response = await dispatch(sendRequest(user, token, 'Merchant/VatRequest', request));
    if(response?.error) onError(response?.error);
    else onSuccess(t('tax.delete_success'));
  }

  const width = size?.width >= 690 ? 690 : size?.width;
  const disabled = request && !show;
  const mainProps = { setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes, setNotes, request };
  const siteProps = { data: sites, setData: setSites, setEdited, setError, disabled };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add', id: 'add_back' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show, id: 'add_btns', msg: 'tax.cancel_message', noSave: disabled};

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
        <div style={{ width }}><ButtonRowCancel {...btnProps} /></div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const TaxAdd = withSizeHOC(Screen);