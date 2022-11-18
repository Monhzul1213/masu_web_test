 import React, { useState, useEffect } from 'react';
 import { message } from 'antd';
 import { useNavigate, useSearchParams } from 'react-router-dom';
 import { useTranslation } from 'react-i18next';
 import { useSelector, useDispatch } from 'react-redux';

import { posList, webList } from '../../helpers';
import { apiLogin, getList, sendRequest } from '../../services';
import { ButtonRowConfirm, Error1, Input, Overlay, Prompt } from '../../components/all';
import { List } from '../../components/emp/role/add';

export function RoleAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState({ value: '' });
  const [posAccess, setPosAccess] = useState('N');
  const [webAccess, setWebAccess] = useState('N');
  const [posData, setPosData] = useState([]);
  const [webData, setWebData] = useState([]);
  const [role, setRole] = useState(null);
  const [deletable, setDeletable] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageEmployy !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

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

  const getData = () => {
    let roleId = searchParams?.get('roleId');
    if(roleId || roleId === 0){
      getRole(roleId)
    } else {
      setPosData(posList);
      setWebData(webList);
    }
  }

  const getRole = async roleId => {
    onLoad();
    let response = await dispatch(getList(user, token, 'Employee/Role/' + roleId));
    if(response?.error) onError(response?.error, false);
    else {
      onSuccess();
      let role = response && response?.data;
      if(role){
        setRole(role);
        setDisabled(role?.roleId === 1);
        setName({ value: role.roleName ?? '' });
        setPosAccess(role?.posAccess);
        setWebAccess(role?.webAccess);
        posList?.forEach(item => item.checked = role[item?.value] === 'Y');
        setPosData(posList);
        webList?.forEach(item => item.checked = role[item?.value] === 'Y');
        setWebData(webList);
        setShow(role && role?.roleId !== 1);
        setDeletable(role?.empQty !== 0);
      }
    }
  }

  const onClickCancel = () => navigate('/employee/access_config');

  const validateData = () => {
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid){
      let data = { merchantId: user?.merchantId, roleId: role?.roleId ?? -1, roleName: name?.value, posAccess, webAccess, rowStatus: role ? 'U' : 'I' };
      posData?.forEach(item => data[item?.value] = (item?.checked && posAccess === 'Y') ? 'Y' : 'N');
      webData?.forEach(item => data[item?.value] = (item?.checked && webAccess === 'Y') ? 'Y' : 'N');
      return [data];
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') });
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Employee/Role', data));
      if(response?.error) onError(response?.error, true);
      else {
        if(role && role?.roleId === user?.msRole?.roleId){
          const response1 = await dispatch(apiLogin(user?.mail, user?.password));
          if(response1?.error) onError(response1?.error, true);
          else onSuccess(t('role.add_success'), true);
        } else 
          onSuccess(t('role.add_success'), true);
      }
    }
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [{...role, rowStatus: 'D'}];
    const response = await dispatch(sendRequest(user, token, 'Employee/Role', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('role.delete_success'), true);
  }

  let nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, inRow: true, setEdited, length: 50 };
  let posProps = { type: 'pos', value: posAccess, setValue: setPosAccess, data: posData, setData: setPosData, disabled };
  let webProps = { type: 'web', value: webAccess, setValue: setWebAccess, data: webData, setData: setWebData, disabled };
  let btnProps = { onClickCancel, onClickSave, onClickDelete, show, id: 'role_ac_back', disabled: deletable, error: 'role.delete_qty' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <div className='ac_back' id='role_ac_back'>
            <Input {...nameProps} />
            <List {...posProps} />
            <List {...webProps} />
          </div>
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}