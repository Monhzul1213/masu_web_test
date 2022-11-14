import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../css/invt.css';
import { getList } from '../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { CardMain } from '../../components/emp/employee/add';
import { CardSite } from '../../components/invt/modifier/add';
import { CardEmpty } from '../../components/invt/inventory/add';

export function EmployeeAdd(props){
  const { } = props;
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [mail, setMail] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [role, setRole] = useState({ value: null });
  const [code, setCode] = useState({ value: '' });
  const [invite, setInvite] = useState(false);
  const [sites, setSites] = useState([]);
  const [checked, setChecked] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
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
    if(msg) message.success(msg);
    if(saved) setSaved(true);
    setLoading(false);
  }

  const getData = async () => {
    // let modifireID = searchParams?.get('modifireID');
    let response = await getSites();
    // if(response && (modifireID || modifireID === 0)) await getModifier(modifireID, response);
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

  const onClickSave = async () => {

  }

  const onClickDelete = async () => {

  }

  let mainProps = { setError, setEdited, name, setName, mail, setMail, phone, setPhone, role, setRole, code, setCode, invite, setInvite };
  let siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked, id: 'emp_ac_back' };
  let siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add', id: 'emp_ac_back' };
  // let btnProps = { onClickCancel, onClickSave, onClickDelete, show: selected ? true : false, id: 'emp_ac_back' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <CardMain {...mainProps} />
          <div className='gap' />
          {sites?.length ? <CardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
        </form>
      </div>
      {/* <ButtonRowConfirm {...btnProps} /> */}
    </Overlay>
  );
}