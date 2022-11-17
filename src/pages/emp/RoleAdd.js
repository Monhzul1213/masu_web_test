 import React, { useState, useEffect } from 'react';
 import { message } from 'antd';
 import { useNavigate, useSearchParams } from 'react-router-dom';
 import { useTranslation } from 'react-i18next';
 import { useSelector, useDispatch } from 'react-redux';

import { posList, webList } from '../../helpers';
import { sendRequest } from '../../services';
import { ButtonRowConfirm, Error1, Input, Overlay, Prompt } from '../../components/all';
import { List } from '../../components/emp/role/add';

export function RoleAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState({ value: '' });
  const [posAccess, setPosAccess] = useState('N');
  const [webAccess, setWebAccess] = useState('N');
  const [posData, setPosData] = useState([]);
  const [webData, setWebData] = useState([]);
  const [role, setRole] = useState(null);
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

  const getData = async () => {
    setPosData(posList);
    setWebData(webList);
  }

  const onClickCancel = () => navigate('/employee/access_config');

  const validateData = () => {
    if(name?.value){
      let data = { merchantId: user?.merchantId, roleId: role?.roleId ?? -1, roleName: name?.value, posAccess, webAccess, rowStatus: role ? 'U' : 'I' };
      posData?.forEach(item => data[item?.value] = item?.checked ? 'Y' : 'N');
      webData?.forEach(item => data[item?.value] = item?.checked ? 'Y' : 'N');
      return [data];
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
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
        //if current user role
        // if(role && role?.email === user?.mail){
        //   let pass = password?.value ? password?.value : user?.password;
        //   const response1 = await dispatch(apiLogin(mail?.value, pass));
        //   if(response1?.error) onError(response1?.error, true);
        //   else onSuccess(t('employee.add_success'), true);
        // } else 
          onSuccess(t('role.add_success'), true);
      }
    }
  }

  const onClickDelete = async () => {
    // onLoad();
    // let data = [{...role, rowStatus: 'D', roleID: role?.roleId, password: '', poS_PIN: '', employeeSites: []}];
    // const response = await dispatch(sendRequest(user, token, 'Employee/Modify', data));
    // if(response?.error) onError(response?.error, true);
    // else onSuccess(t('employee.delete_success'), true);
  }

  let nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, inRow: true, setEdited, length: 50 };
  let posProps = { type: 'pos', value: posAccess, setValue: setPosAccess, data: posData, setData: setPosData };
  let webProps = { type: 'web', value: webAccess, setValue: setWebAccess, data: webData, setData: setWebData };
  let btnProps = { onClickCancel, onClickSave, onClickDelete, show, id: 'role_ac_back' };

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

/**

import '../../css/invt.css';
import { apiLogin, getList, sendRequest } from '../../services';
import { validateEmail } from '../../helpers';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { CardMain } from '../../components/emp/employee/add';
import { CardSite } from '../../components/invt/modifier/add';
import { CardEmpty } from '../../components/invt/inventory/add';

export function EmployeeAdd(){
  const [mail, setMail] = useState({ value: '' });
  const [password, setPassword] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [role, setRole] = useState({ value: null });
  const [code, setCode] = useState({ value: '' });
  const [sites, setSites] = useState([]);
  const [checked, setChecked] = useState(true);
  const [searchParams] = useSearchParams();

  const getData = async () => {
    let empCode = searchParams?.get('empCode');
    let response = await getSites();
    if(response && (empCode || empCode === 0)) await getEmployee(empCode, response);
  }

  const getEmployee = async (empCode, sites1) => {
    onLoad();
    let response = await dispatch(getList(user, token, 'Employee/GetEmployees?EmpCode=' + empCode));
    if(response?.error) onError(response?.error, false);
    else {
      onSuccess();
      let emp = response && response?.data && response?.data[0];
      if(emp){
        setRole(emp);
        setShow(emp?.isOwner !== 'Y' && emp?.email !== user?.mail);
        setName({ value: emp.empName ?? '' });
        setMail({ value: emp.email ?? '' });
        setPhone({ value: emp.phone ?? '' });
        setCode({ value: emp.poS_PIN ?? '' });
        setRole({ value: emp?.roleId });
        setChecked(emp?.useAllSite === 'Y');
        sites1?.forEach(item => {
          let exists = emp?.empsites?.filter(si => si.siteId === item.siteId)[0];
          item.checked = exists ? true : false;
          item.rowStatus = exists ? 'U' : 'I';
        });
        setSites(sites1);
      }
    }
  }

  const getSites = async () => {
    onLoad();
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error){
      onError(response?.error, false);
      return false;
    } else {
      response?.data?.forEach(item => {
        item.checked = true;
        item.rowStatus = 'I';
      });
      setSites(response?.data);
      onSuccess();
      return response?.data;
    }
  }
 */