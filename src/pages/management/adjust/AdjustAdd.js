import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getList, sendRequest } from '../../../services';
import { add } from '../../../helpers';
import { Error1, Overlay, Prompt } from '../../../components/all';
import { Main, List, ButtonRow } from '../../../components/management/adjust/add';

export function AdjustAdd(){
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
    let adjustNo = searchParams?.get('adjustNo');
    if(adjustNo){
      onLoad();
      const response = await dispatch(getList(user, token, 'Txn/GetAdjust?AdjustNo=' + adjustNo));
      if(response?.error) onError(response?.error, false);
      else {
        let header = response?.data?.adjfinal && response?.data?.adjfinal[0];
        setHeader(header);
        setEditable(header?.status !== 1);
        setSiteId({ value: header?.siteId });
        setNotes({ value: header?.descr });
        response?.data?.inAdjustitem?.map(item => {
          item.adjustItemID = item.adjustItemId;
          item.sourceItemID = item.sourceItemId;
          item.origCost = item.cost;
          item.rowStatus = 'U';
          item.name = item.InvtName;
          item.allowDecimal = item?.isEach === 'N';
          item.leftQty = add(item.siteQty, item.qty);
        });
        setDetail(response?.data?.inAdjustitem);
        onSuccess();
      }
    }
  }

  const onClickCancel = () => navigate({ pathname: '/management/adjust' });

  const validateData = status => {
    let isSiteValid = siteId?.value || siteId?.value === 0;
    let length = detail?.filter(item => item?.qty)?.length;
    if(isSiteValid && length){
      let adjustNo = header?.adjustNo ?? 0;
      let inAdjust = { adjustNo, orderNo: 0, siteID: siteId?.value, status, descr: notes?.value, rowStatus: adjustNo ? 'U' : 'I' };
      let inAdjustItems = [];
      detail?.forEach(item => {
        if(item?.qty){
          item.adjustNo = adjustNo;
          inAdjustItems.push(item);
        }
      })
      dItems?.forEach(it => inAdjustItems?.push({...it, rowStatus: 'D'}));
      return { inAdjust, inAdjustItems };
    } else {
      if(!(siteId?.value || siteId?.value === 0)) setSiteId({ value: siteId?.value, error: t('error.not_empty') });
      if(!length) setSearch({ value: null, error: t('adjust.items_error') });
      return false;
    }
  }

  const onClickSave = async status => {
    let data = validateData(status);
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModAdjust', data, null, 'GET'));
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('adjust.add_success'));
    }
  }

  const onClickDelete = async () => {
    // comment
    // let data = validateData(0, true);
    // if(data){
    //   onLoad();
    //   const response = await dispatch(sendRequest(user, token, 'Txn/ModReceiptPO', data));
    //   if(response?.error) onError(response?.error, true);
    //   else onSuccess(t('order.order_delete_success'), header?.orderNo);
    // }
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


  let mainProps = { setError, setEdited, header, detail, siteId, setSiteId, notes, setNotes, editable };
  let listProps = { detail, setDetail, search, setSearch, siteId, setEdited, setDItems, editable };
  let btnProps = { onClickCancel, onClickSave: () => onClickSave(1), onClickDraft: () => onClickSave(0), onClickDelete, header };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
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