import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { apiLogin, getList, sendRequest } from '../../services';
import { validateEmail } from '../../helpers';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { CardMain, Subscription } from '../../components/emp/employee/add';
import { CardSite } from '../../components/invt/modifier/add';
import { CardEmpty } from '../../components/invt/inventory/add';

export function EmployeeAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [mail, setMail] = useState({ value: '' });
  const [password, setPassword] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [role, setRole] = useState({ value: null });
  const [code, setCode] = useState({ value: '' });
  const [sites, setSites] = useState([]);
  const [checked, setChecked] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
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

  const onClickCancel = () => navigate('/employee/emp_list');
  
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
        setSelected(emp);
        setShow(emp?.isOwner !== 'Y' && emp?.email?.toLowerCase() !== user?.mail?.toLowerCase());
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

  const validateData = () => {
    let codeLength = 4, passwordLength = 8, nameLength = 2, phoneLength = 8;
    let isEmailValid = validateEmail(mail?.value);
    let pin = code?.value?.replace(/[ _]/g, '');
    let isCodeValid = pin?.length === 4;
    let isPasswordValid = (selected && !password?.value) || password?.value?.length >= passwordLength;
    let isNameValid = name?.value?.length >= nameLength;
    let isPhoneValid = !phone?.value || phone?.value?.length >= phoneLength;
    if(isNameValid && isEmailValid && (role?.value || role?.value === 0) && isCodeValid && isPasswordValid && isPhoneValid){
      let employeeSites = [];
      sites?.forEach(item => {
        if(item?.checked) employeeSites.push({ siteID: item?.siteId, rowStatus: item?.rowStatus ?? 'I' });
        else if(item?.rowStatus === 'U') employeeSites.push({ siteID: item?.siteId, rowStatus: 'D' });
      });
      let data = [{
        empCode: selected?.empCode ?? -1, empName: name?.value, email: mail?.value,
        password: password?.value, employeeSites, phone: phone?.value, roleID: role?.value,
        rowStatus: selected ? 'U' : 'I', useAllSite: checked ? 'Y' : 'N', poS_PIN: pin,
        status: selected?.status ?? 0
      }];
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') });
      if(!mail?.value) setMail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setMail({ value: mail?.value, error: t('error.be_right') });
      if(!(role?.value || role?.value === 0)) setRole({ value: role?.value, error: t('error.not_empty') });
      if(!code?.value) setCode({ value: '', error: t('error.not_empty') });
      else if(!isCodeValid) setCode({ value: code?.value, error: codeLength + t('error.must_be') });
      if(!password?.value && !selected) setPassword({ value: '', error: t('error.not_empty') });
      else if(!isPasswordValid) setPassword({ value: password?.value, error: ' ' + passwordLength + t('error.longer_than') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') })
      return false;
    }
  }

  const saveData = async data => {
    onLoad();
    const response = await dispatch(sendRequest(user, token, 'Employee/Modify', data));
    if(response?.error) onError(response?.error, true);
    else {
      if(selected && selected?.email?.toLowerCase() === user?.mail?.toLowerCase()){
        let pass = password?.value ? password?.value : user?.password;
        const response1 = await dispatch(apiLogin(mail?.value, pass));
        if(response1?.error) onError(response1?.error, true);
        else onSuccess(t('employee.add_success'), true);
      } else if(selected) {
        onSuccess(t('employee.add_success'), true);
      } else {
        setSelected(response?.data && response?.data[0]);
        setVisible(true);
      }
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data) saveData(data);
  }

  const onBack = async () => {
    setVisible(false);
    setSaved(true);
  }

  const onDone = () => {
    setVisible(false);
    let employeeSites = selected?.employeeSites?.map(item => {
      item.rowStatus = 'U';
      return item;
    });
    let data = [{...selected, employeeSites, rowStatus: 'U', status: 1, password: ''}];
    saveData(data);
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [{...selected, rowStatus: 'D', roleID: selected?.roleId, password: '', poS_PIN: '', employeeSites: []}];
    const response = await dispatch(sendRequest(user, token, 'Employee/Modify', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('employee.delete_success'), true);
  }

  let mainProps = { setError, setEdited, name, setName, mail, setMail, password, setPassword, phone, setPhone, role, setRole, code, setCode, selected,
    isOwner: selected?.isOwner === 'Y' };
  let siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked, id: 'ea_back', label: 'employee' };
  let siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add', id: 'ea_back' };
  let btnProps = { onClickCancel, onClickSave, onClickDelete, show, id: 'emp_ac_btns' };
  let subProps = { visible, emp: selected, onBack, onDone };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {visible && <Subscription {...subProps} />}
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <CardMain {...mainProps} />
          <div className='gap' />
          {sites?.length ? <CardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}