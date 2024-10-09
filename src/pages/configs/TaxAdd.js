import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { withSize } from 'react-sizeme';
import mime from 'mime';

import { urlToFile } from '../../helpers';
import { getList, getServiceBar, sendRequest } from '../../services';
import { Error1, Overlay, Prompt, ButtonRowCancel, Empty1 } from '../../components/all';
import { Main, List } from '../../components/config/tax/add';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [nomer, setNomer] = useState({ value: '' });
  const [notes, setNotes] = useState({ value: '' });
  const [checked, setChecked] = useState(false);
  const [checkedList, setCheckedList] = useState(false);
  const [sites, setSites] = useState([]);
  const [saved, setSaved] = useState(false);
  const [request, setRequest] = useState(null);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [branch, setBranch] = useState([]);
  const [subBranch, setSubBranch] = useState([]);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getBranchs();
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
    const response = await dispatch(getList(user, token, 'Merchant/VatRequest/GetVatRequest'));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        item.name = item?.siteName
      })
      setSiteData(response?.data);
    }
  }

  const setSiteData = data => {
    // let error = [];
    // data?.forEach(item => {
    //   if(!item.district) item.district = item.descr ?? '';
    //   if(!item.district) error.push(item.name);
    // });
    // if(error?.length){
    //   setError(t('tax.code_error') + " (" + error?.join(', ') + ")");
    //   setValid(false);
    // } else
    //   setValid(true);
    setSites(data);
  }

  const getBranchs = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getServiceBar('getBranchInfo'));
    if(response?.error) setError(response?.error);
    else {
      let data = [];
      response?.data?.data?.forEach(item => {
        let index = data?.findIndex(list => item.branchCode === list.branchCode )
        if(index === -1 ) data.push(item)
      })
      setBranch(data);
      setSubBranch(response?.data?.data);
    }
    setLoading(false);
  }

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

  const getRequest = async requestId => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/VatRequest/GetVatRequest?ReqeustId=' + requestId ));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      let request = response?.data?.vatrequest;
      setRegNo({ value: request?.vatPayerNo });
      setName({ value: request?.vatPayerName });
      setNomer({ value: request?.tinId });
      setChecked((request?.isVat + '') === '1');
      setNotes({ value: request?.descr });
      setRequest(request);
      // setShow(request?.status + '' === '1');
      request?.items?.map(item => {
        item.hasLocation = true;
        item.rowStatus = 'U';
        item.name = item.siteName;
        return item;
      });
      setSiteData(request?.items);
      getImage(request)
      // setSites(items);
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
    let length = sites?.length;
    let branchs = false, subBranchs = false;
    sites?.forEach(item => {
      if(item?.checked) {
        branchs = item?.branchCode === null;
        subBranchs = item?.subBranchCode === null;
      }
      }
    )
    if(regNo?.value && name?.value && length && !branchs && !subBranchs){
      // let items = sites?.filter(item => item.rowStatus === 'D');
      let vatRequestTerminalItem = [];
      sites?.forEach(item => {
        if(item?.checked){
          vatRequestTerminalItem.push({
              siteID: item?.siteId ?? item?.siteID, rowStatus: 'I',
              branchCode: item?.branchCode, subBranchCode: item?.subBranchCode, terminalID : item?.terminalId
            })
        }
      });

      let data = {
        reqeustId: request?.requestId ?? -1,
        requestId: request?.requestId ?? -1,
        vatPayerNo: regNo?.value, vatPayerName: name?.value, isVat: checked ? 1 : 0,
        vatPayerPhone: '', status: 1, descr: notes?.value ?? '',
        rowStatus: request ? 'U' : 'I', tinID: nomer?.value,
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        vatRequestTerminalItem
      };

      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(branchs) setError(t('tax.branchCode_select'));
      if(subBranchs) setError(t('tax.subBranchCode_select'));
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
    request.vatRequestTerminalItem = request?.items;
    let response = await dispatch(sendRequest(user, token, 'Merchant/VatRequest', request));
    if(response?.error) onError(response?.error);
    else onSuccess(t('tax.delete_success'));
  }

  const width = size?.width >= 690 ? 690 : size?.width;
  const disabled = request;
  const mainProps = { setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes, setNotes, 
    request, image, setImage, setImage64, setImageType, nomer, setNomer };
  const siteProps = { data: sites, setData: setSites, setEdited, setError, disabled, branch, subBranch, getBranchs, checked: checkedList, setChecked: setCheckedList };
  const emptyProps = { icon: 'MdStorefront', text: 'tax.empty', id: 'add_back' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', id: 'add_btns', msg: 'tax.cancel_message', noSave: disabled };

  return (
    <div className='add_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        <Prompt edited={edited} />
        {error && <Error1 error={error} />}
        <div className='i_scroll'>
          <form style={{ width }}>
            <Main {...mainProps} />
            <div className='gap' />
            {sites?.length ? <List {...siteProps} /> : <Empty1 {...emptyProps} />}
          </form>
        </div>
        <div style={{ width }}><ButtonRowCancel {...btnProps} /></div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const TaxAdd = withSizeHOC(Screen);