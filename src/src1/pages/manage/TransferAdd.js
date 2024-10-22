import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getList, sendRequest } from '../../../services';
import { add } from '../../../helpers';
import { Error1, Overlay, Prompt, Confirm } from '../../../components/all';
import { Main, List, ButtonRow } from '../../components/management/transfer/add';
import { Subscription } from '../../../components/management/adjust/list';

export function TransferAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [items, setItems] = useState([]);
  const [toSiteId, setToSiteId] = useState({ value: null });
  const [fromSiteId, setFromSiteId] = useState({ value: null });
  const [notes, setNotes] = useState({ value: '' });
  const [search, setSearch] = useState({ value: null });
  const [dItems, setDItems] = useState([]);
  const [saved, setSaved] = useState(false);
  const [editable, setEditable] = useState(true);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);
  const [status1, setStatus] = useState(0);
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
    let transferNo = searchParams?.get('transferNo');
    if(transferNo){
      onLoad();
      const response = await dispatch(getList(user, token, 'Txn/GetTransfer?TransferNo=' + transferNo));
      if(response?.error) onError(response?.error, false);
      else {
        let header = response?.data?.inTransfer && response?.data?.inTransfer[0];
        setHeader(header);
        setEditable(header?.status !== 1);
        setFromSiteId({ value: header?.fromSiteId });
        setToSiteId({ value: header?.toSiteId });
        setNotes({ value: header?.descr });
        response?.data?.inTransferItem?.forEach((item) => {
          item.transferItemID = item.transferItemId;
          item.rowStatus = 'U';
          item.name = item.invtName;
          item.leftQty = add(item.siteQty, item.qty, item);
        });
        setDetail(response?.data?.inTransferItem);
        setItems(response?.data?.inTransferItem);
        onSuccess();
      }
    }
  }

  const onClickCancel = () => navigate({ pathname: '/management/transfer' });

  const validateData = status => {
    let isFromSiteValid = fromSiteId?.value || fromSiteId?.value === 0;
    let isToSiteValid = toSiteId?.value || toSiteId?.value === 0;
    let length = detail?.filter(item => item?.qty)?.length;
    if(isFromSiteValid && length && isToSiteValid){
      let transferNo = header?.transferNo ?? 0;
      let inTransfer = { transferNo, fromSiteID: fromSiteId?.value, toSiteID: toSiteId?.value, status, descr: notes?.value, rowStatus: transferNo ? 'U' : 'I' };
      let inTransferItem = [];
      detail?.forEach(item => {
        if(item?.qty){
          // item.transferItemID = transferNo;
          inTransferItem.push(item);
        }
      })
      dItems?.forEach(it => inTransferItem?.push({...it, rowStatus: 'D'}));
      return { inTransfer, inTransferItem };
    } else {
      if(!(fromSiteId?.value || fromSiteId?.value === 0)) setFromSiteId({ value: fromSiteId?.value, error: t('error.not_empty') });
      if(!(toSiteId?.value || toSiteId?.value === 0)) setToSiteId({ value: toSiteId?.value, error: t('error.not_empty') });
      if(!length) setSearch({ value: null, error: t('transfer.items_error') });
      return false;
    }
  }

  const onClickSave = async status => {
    let data = validateData(status);
    if(data){
      setStatus(status);
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModTransfer', data));
      if(response?.code === 1001){
        onError(response?.error, true);
        setOpen(true);
        setSites(response?.data);
      }
      else if(response?.error) onError(response?.error, true);
      else onSuccess(t('transfer.add_success'));
    }
  }

  const onClickDelete = async () => {
    let inTransfer = {...header, rowStatus: 'D'};
    let inTransferItem = items?.map(item => { return {...item, rowStatus: 'D'}});
    let data = { inTransfer, inTransferItem };
    onLoad();
    const response = await dispatch(sendRequest(user, token, 'Txn/ModTransfer', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('transfer.delete_success'));
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

  let mainProps = { setError, setEdited, header, detail, fromSiteId, setFromSiteId, toSiteId, setToSiteId, notes, setNotes, editable };
  let listProps = { detail, setDetail, search, setSearch, fromSiteId, toSiteId, setEdited, setDItems, editable, setToSiteId, setFromSiteId };
  let btnProps = { onClickCancel, onClickSave: () => onClickSave(1), onClickDraft: () => onClickSave(0), onClickDelete, header };
  let subProps = { visible, setVisible, sites, setSites, onDone, noTrial: true, noBack: true };
  let confirmProps = { open, text: t('adjust.confirm_pay'), confirm, text1: error, status1};

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
          <div className='tr_back' id='po_back_invt'>
            <List {...listProps} />
          </div>
        </form>
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}
