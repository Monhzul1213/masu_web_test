import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import '../../css/invt.css';
import '../../css/config.css';
import { getList, sendRequest } from '../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
// import { Main, List } from '../../components/system/solve/add';

export function InvoiceAdd(){
  return (
    <div>InvoiceAdd</div>
  );
}
/*
export function SolveAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [notes, setNotes] = useState({ value: '' });
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState({ value: null });
  const [items, setItems] = useState([]);
  const [request, setRequest] = useState(null);
  const [saved, setSaved] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchParams] = useSearchParams();
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
  }, [saved]);

  const onClickCancel = () => navigate('/system/request_solve');

  const getData = async () => {
    let requestId = searchParams?.get('requestId');
    setError(null);
    setLoading(true);
    let api = 'Merchant/VatRequest/GetSolvedRequests?RequestID=' + requestId;
    let response = await dispatch(getList(user, token, api));
    console.log(response);
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      let request = response?.data && response?.data[0];
      if(request){
        setDisabled(request?.status === 0 || request?.status === 4 ? true : false);
        setRequest(request);
        setRegNo({ value: request?.vatPayerNo });
        setName({ value: request?.vatPayerName });
        setChecked((request?.isVat + '') === '1');
        setNotes({ value: request?.descr });
        setStatus({ value: request?.status });
        request?.requestItem?.forEach(item => {
          item.coordinate = item.locationY + '\n' + item.locationX;
          if(request?.status === 4 && item.requestFiles && item.requestFiles[0]) item.fileName = item.requestFiles[0].fileName;
        });
        setItems(request?.requestItem);
      }
    }
  }

  const validateData = () => {
    let names = [];
    items?.forEach(item => { if(item.fileName) names.push(item.fileName); });
    let lengthValid = names?.length === items?.length;
    let nameValid = names.length === new Set(names).size;
    if(status?.value !== 4 || (lengthValid && nameValid)){
      let msVatRequestFiles = items?.map(item => {
        return { 
          rowStatus: 'I',
          siteId: item?.siteId,
          terminalId: item?.terminalID,
          fileName: item?.fileName ?? '',
          fileraw: item?.fileRaw ?? {}
        }
      });
      let data = {
        requestID: request?.requestId,
        descr: notes?.value,
        status: status?.value,
        rowStatus: 'U',
        msVatRequestFiles: status?.value === 4 ? msVatRequestFiles : []
      }
      return data;
    }
    else if(!lengthValid) setError(t('tax.file_error'));
    else if(!nameValid) setError(t('tax.name_error'));
    return false;
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

  const onClickSave = async () => {
    let data = validateData();
    console.log(data);
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Merchant/VatRequestSolve', data));
      console.log(response);
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('tax.solve_success'), true);
    }
  }
  
  let mainProps = { setError, setEdited, regNo, name, checked, status, setStatus, notes, setNotes, disabled };
  let listProps = { data: items, setData: setItems, setEdited, setError, disabled, status };
  let btnProps = { onClickCancel, onClickSave, id: 'add_btns', noSave: disabled };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <Main {...mainProps} />
          <div className='gap' />
          {items?.length ? <List {...listProps} /> : null}
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}
*/