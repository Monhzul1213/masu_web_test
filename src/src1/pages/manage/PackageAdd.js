import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getList, sendRequest } from '../../../services';
import { Confirm, Error1, Overlay, Prompt } from '../../../components/all';
import { Main, List, ButtonRow } from '../../components/management/package/add';
import { Subscription } from '../../../components/management/adjust/list';
import moment from 'moment';
import { divide } from '../../../helpers';

export function PackageAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [siteId, setSiteId] = useState({ value: null });
  const [notes, setNotes] = useState({ value: '' });
  const [search, setSearch] = useState({ value: null });
  const [dItems, setDItems] = useState([]);
  const [saved, setSaved] = useState(false);
  const [editable, setEditable] = useState(true);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState({ value: moment() });
  const [packNo, setPackNo] = useState(null);
  const [type, setType] = useState({ value: 0 });
  const [invt, setInvt] = useState({ value: null });
  const [qty, setQty] = useState(null);
  const [cost, setCost] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [status, setStatus] = useState({ value: null });
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let assemblyNo = searchParams?.get('assemblyNo');
    if(assemblyNo){
      onLoad();
      const response = await dispatch(getList(user, token, 'Txn/GetAssembly?AssemblyNo=' + assemblyNo));
      if(response?.error) onError(response?.error, false);
      else {
        let header = response?.data?.assembly && response?.data?.assembly[0];
        setHeader(header);
        setPackNo({ value: header?.assemblyNo });
        setEditable(header?.status !== 1);
        setSiteId({ value: header?.siteId });
        setType({ value: header?.txnType });
        setInvt({ value: header?.invtId });
        setQty({ value: header?.qty });
        setCost({ value: header?.cost });
        setTotalCost({ value: header?.totalCost });
        setNotes({ value: header?.descr });
        response?.data?.assemblyitem?.forEach(item => {
          item.name = item.invtName;
          item.lQty = divide(item?.qty, header?.qty)
        });
        setDetail(response?.data?.assemblyitem);
        // setItems(response?.data?.assemblyitem);
        onSuccess();
      }
    }
  }

  const onClickCancel = () => navigate({ pathname: '/management/package' });

  const validateData = status => {
    let isSiteValid = siteId?.value || siteId?.value === 0;
    let length = detail?.filter(item => item?.qty)?.length;
    if(isSiteValid && length && qty?.value){
      let assemblyNo = header?.assemblyNo ?? 0;
      let items = [];
      detail?.forEach(item => {
        if(item?.qty){
          item.invtID = item?.invtId;
          item.rowStatus = assemblyNo ? 'U' : 'I';
          items.push(item);
        }
      })
      dItems?.forEach(it => items?.push({...it, rowStatus: 'D'}));
      return { assemblyNo, siteID: siteId?.value, txnDate: date?.value?.format('yyyy.MM.DD'), txnType: type?.value, invtID: invt?.value, status, 
      qty: qty?.value, cost: cost?.value, totalCost: totalCost?.value, descr: notes?.value, rowStatus: assemblyNo ? 'U' : 'I', items };
    } else {
      if(!(siteId?.value || siteId?.value === 0)) setSiteId({ value: siteId?.value, error: t('error.not_empty') });
      if(!qty?.value) setQty({ value: qty?.value, error: t('error.not_empty') });
      if(!length) setSearch({ value: null, error: t('adjust.items_error') });
      return false;
    }
  }

  const onClickSave = async status => {
    let data = validateData(status);
    if(data){
      // setStatus(status);
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModAssembly', data));
      if(response?.code === 1001){
        onError(response?.error, true);
        setOpen(true);
        setSites(response?.data);
      }
      else if(response?.error) onError(response?.error, true);
      else onSuccess(t('package.add_success'));
    }
  }

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  }

  const onError = (err, edited) => {
    setError(err);
    setEdited(edited);
    setLoading(false);
  }

  const onSuccess = msg => {
    if(msg){
      message.success(msg);
      setSaved(true);
    }
    setLoading(false);
  }

  const onDone = async () => {
    setVisible(false);
    setSites([]);
    // onClickSave(status1);
  }

  const confirm = sure => {
    setOpen(false);
    setError(null);
    if(sure) setVisible(true);
  }

  const onClickDelete = async () => {
    let data = {...header, rowStatus: 'D', items: [] };
    onLoad();
    const response = await dispatch(sendRequest(user, token, 'Txn/ModAssembly', data));
    console.log(data);
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('adjust.delete_success'));
  }

  let mainProps = { setError, setEdited, header, detail, siteId, setSiteId, notes, setNotes, editable, packNo, setPackNo, date, setDate,
                    type, setType, invt, setInvt, qty, setQty, cost, setCost, totalCost, setTotalCost, status, setStatus, setDetail };
  let listProps = { detail, setDetail, search, setSearch, siteId, setEdited, setDItems, editable};
  let btnProps = { onClickCancel, onClickSave: () => onClickSave(1), onClickDraft: () => onClickSave(0), onClickDelete, header };
  let subProps = { visible, setVisible, sites, setSites, onDone, noTrial: true };
  let confirmProps = { open, text: t('adjust.confirm_pay'), confirm, text1: error };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      <Confirm {...confirmProps} />
      {visible && <Subscription {...subProps} />}
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <Main {...mainProps} />
          <div className='gap' />
          <div className='po_back' id='po_back_invt'>
            <List {...listProps} />
          </div>
        </form>
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}