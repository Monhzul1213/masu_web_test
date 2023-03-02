import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import '../../css/invt.css';
import '../../css/config.css';
import { getList, sendRequest } from '../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { Main } from '../../components/system/invoice/add';

export function InvoiceAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [searchParams] = useSearchParams();
  const [approved1, setApproved1] = useState(false);
  const [approved2, setApproved2] = useState(false);
  const [editable1, setEditable1] = useState(true);
  const [editable2, setEditable2] = useState(true);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.isAdmin ? getData() : navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved])

  const getData = async () => {
    let invoiceNo = searchParams?.get('invoiceNo');
    setError(null);
    setLoading(true);
    let api = 'Txn/GetInvoice?InvoiceNo=' + invoiceNo;
    let response = await dispatch(getList(user, token, api));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      let request = response?.data && response?.data[0];
      if(request){
        request.label1 = (request.descr ?? '') + '-' + (request.empName ?? '') + '-' + (request.phone ?? '');
        setApproved1(request?.approvedLevel1 === 'Y');
        setApproved2(request?.approvedLevel2 === 'Y');
        setInvoice(request);
        setEditable1(user?.Approved_level1 === 'Y');
        setEditable2(user?.Approved_level2 === 'Y' && request?.approvedLevel1 === 'Y');
      }
    }
  }
  
  const onClickCancel = () => navigate('/system/invoice');

  const onClickSave = async () => {
    let data = {
      invoiceNo: invoice?.invoiceNo,
      status: editable2 ? 3 : editable1 ? 2 : invoice?.status,
      approved_level1: editable1 ? (approved1 ? 'Y' : 'N') : invoice?.approvedLevel1,
      approved_level2: editable2 ? (approved2 ? 'Y' : 'N') : invoice?.approvedLevel2,
    };
    console.log(data);
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModSubscription', data));
      console.log(response);
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('tax.solve_success'), true);
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

  const onSuccess = (msg, saved) => {
    if(msg) message.success(t(msg));
    if(saved) setSaved(true);
    setLoading(false);
  }

  let mainProps = { setEdited, invoice, approved1, setApproved1, approved2, setApproved2, editable1, editable2 };
  let btnProps = { onClickCancel, onClickSave, id: 'add_btns' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <Main {...mainProps} />
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}