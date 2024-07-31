import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import mime from 'mime';

import { urlToFile } from '../../helpers';
import '../../css/invt.css';
import '../../css/config.css';
import { getList, getServiceBar, sendRequest } from '../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { Main, List } from '../../components/system/solve/add';

export function SolveAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [tinId, setTinId] = useState({ value: '' });
  const [notes, setNotes] = useState({ value: '' });
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState({ value: null });
  const [items, setItems] = useState([]);
  const [request, setRequest] = useState(null);
  const [saved, setSaved] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
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

  const getImage = async image => {
    if(image?.fileRaw?.fileData){
      let type = image?.fileRaw?.fileType?.replace('');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${image?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }

  const getData = async () => {
    let requestId = searchParams?.get('requestId');
    setError(null);
    setLoading(true);
    let api = 'Merchant/VatRequest/GetVatRequest?ReqeustId=' + requestId;
    let response = await dispatch(getList(user, token, api));
    let response1 = await dispatch(getServiceBar('getBranchInfo'));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      let request = response?.data?.vatrequest;
      if(request){
        setDisabled(request?.status === 0 || request?.status === 4 ? true : false);
        setRequest(request);
        setRegNo({ value: request?.vatPayerNo });
        setName({ value: request?.vatPayerName });
        setTinId({ value: request?.tinID });
        setChecked((request?.isVat + '') === '1');
        setNotes({ value: request?.descr });
        setStatus({ value: request?.status });
        // request?.items?.forEach(item => {
        //   if(request?.status === 4 && item.requestFiles && item.requestFiles[0]) item.fileName = item.requestFiles[0].fileName;
        // });
        request?.items?.forEach(item => {
          response1?.data?.data?.forEach(li => {
            if(li?.branchCode?.includes(item?.branchCode)){
              item.branchName = li?.branchName
            }
          })
          response1?.data?.data?.forEach(li => {
            if(li?.branchCode?.includes(item?.branchCode)){
              if(li?.subBranchCode === item?.subBranchCode ){
                item.subBranchName = li?.subBranchName
              }
            }
          })
          if(request?.status === 4 && item.requestFiles && item.requestFiles[0]) item.fileName = item.requestFiles[0].fileName;
        })
        setItems(request?.items);
      } 
      getImage(request)
    }
  }

  const validateData = () => {
    let names = [];
    items?.forEach(item => { if(item.fileName) names.push(item.fileName); });
    let lengthValid = true;// names?.length === items?.length;
    let nameValid = names.length === new Set(names).size;
    if(status?.value !== 4 || (lengthValid && nameValid)){
      let vatRequestTerminalItem = items?.map(item => {
        return { 
          rowStatus: 'I',
          siteID: item?.siteId,
          terminalID: item?.terminalId,
          status: item?.status,
          branchCode: item?.branchCode,
          subBranchCode: item?.subBranchCode
          // fileName: item?.fileName ?? '',
          // fileraw: item?.fileRaw ?? {}
        }
      });
      let data = {
        vatPayerNo: regNo?.value, vatPayerName: name?.value, 
        isVat: checked ? 1 : 0,
        vatPayerPhone: '',
        tinID: tinId?.value,
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        reqeustId: request?.requestId, 
        descr: notes?.value,
        status: status?.value,
        rowStatus: 'U',
        // vatRequestTerminalItem: status?.value === 4 ? vatRequestTerminalItem : []
        vatRequestTerminalItem 
      }
      return data;
    }
    // else if(!lengthValid) setError(t('tax.file_error'));
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
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Merchant/VatRequest', data));
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('tax.solve_success'), true);
    }
  }
  
  let mainProps = { setError, setEdited, regNo, name, checked, status, setStatus, notes, setNotes, disabled, setImage, 
                    image, image64, setImage64, setImageType, imageType, tinId };
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