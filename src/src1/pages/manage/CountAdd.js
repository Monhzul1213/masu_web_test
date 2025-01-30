import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getList, sendRequest } from '../../../services';
import { Confirm, Error1, Overlay, Prompt } from '../../../components/all';
import { Main, List, ButtonRow } from '../../components/management/count/add';
import { Subscription } from '../../../components/management/adjust/list';

export function CountAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [count, setCount] = useState(null);
  const [detail, setDetail] = useState([]);
  // const [items, setItems] = useState([]);
  const [siteId, setSiteId] = useState({ value: null });
  const [empCode, setEmpCode] = useState({ value: null });
  const [date, setDate] = useState({ value: moment() });
  const [status, setStatus] = useState({ value: 0 });
  const [notes, setNotes] = useState({ value: '' });
  const [search, setSearch] = useState({ value: null });
  const [dItems, setDItems] = useState([]);
  const [saved, setSaved] = useState(false);
  const [editable, setEditable] = useState(true);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);
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
    let picountNo = searchParams?.get('piCountNo');
    if(picountNo){
      onLoad();
      const response = await dispatch(getList(user, token, 'Txn/GetPiCount?PiCountNo=' + picountNo));
      if(response?.error) onError(response?.error, false);
      else {
        let header = response?.data?.picount && response?.data?.picount[0];
        setHeader(header);
        setEditable(header?.status === 0 || header?.status === 1);
        setSiteId({ value: header?.siteId });
        setCount({ value: header?.picountNo});
        setEmpCode({ value: header?.txnEmpCode });
        setStatus({value: header?.status})
        setNotes({ value: header?.descr });
        response?.data?.picountitem?.forEach(item => {
          item.name = item?.invtName
          item.invtID = item?.invtId
          item.rowStatus = 'U';
        });
        setDetail(response?.data?.picountitem);
        // setItems(response?.data?.picountitem);
        onSuccess();
      }
    }
  }

  const onClickCancel = () => navigate({ pathname: '/management/count' });

  const validateData = () => {
    let isSiteValid = siteId?.value || siteId?.value === 0;
    let countNo = header?.picountNo && status?.value === 0;
    if(isSiteValid && !countNo){
      let picountNo = header?.picountNo ?? 0;
      let items = [];
      detail?.forEach(item => {
        // if(item?.qty){
          item.picountNo = picountNo;
          items.push(item);
        // }
      })
      dItems?.forEach(it => items?.push({...it, rowStatus: 'D'}));
      return { picountNo, txnDate: date?.value?.format('yyyy.MM.DD'), siteID: siteId?.value, status:status?.value, descr: notes?.value, rowStatus: picountNo ? 'U' : 'I', items };
    } else {
      if(!(siteId?.value || siteId?.value === 0)) setSiteId({ value: siteId?.value, error: t('error.not_empty') });
      if(countNo) setError(t('count.count_error') );
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      // setStatus(status);
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModPiCount', data));
      if(response?.code === 1001){
        onError(response?.error, true);
        setOpen(true);
        setSites(response?.data);
      }
      else if(response?.error) onError(response?.error, true);
      else onSuccess(t('count.add_success'));
    }
  }

  const onClickDelete = async () => {
    onLoad();
    let data = {...header, rowStatus: 'D', items: []};
    const response = await dispatch(sendRequest(user, token, 'Txn/ModPiCount', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('count.delete_success'), true);
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

  let mainProps = { setError, setEdited, header, detail, siteId, setSiteId, notes, setNotes, editable, empCode, setEmpCode, 
                    count, setCount, status, setStatus, date, setDate };
  let listProps = { detail, setDetail, search, setSearch, siteId, setEdited, setDItems, editable, header, setSiteId, status };
  let btnProps = { onClickCancel, onClickSave, onClickDelete, header };
  let subProps = { visible, setVisible, sites, setSites, onDone, noTrial: true};
  let confirmProps = { open, text: t('count.confirm_pay'), confirm, text1: error };

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