import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import '../../css/invt.css';
import { getList } from '../../services';
import { ButtonRow1, Confirm, Error1, Overlay } from '../../components/all';
import { CardOption, CardSite } from '../../components/invt/modifier/add';
import { CardEmpty } from '../../components/invt/inventory/add';

export function ModifierAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [items, setItems] = useState([]);
  const [dItems, setDItems] = useState([]);
  const [sites, setSites] = useState([]);
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getSites();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.map(item => item.checked = true);
      setSites(response?.data);
    }
    setLoading(false);
  }

  const onClickCancel = () => {
    if(edited) setOpen(true);
    else navigate('/inventory/invt_modi');
  }

  const confirm = sure => {
    setOpen(false);
    if(sure) navigate('/inventory/invt_modi');
  }

  const onClickSave = async () => {

  }

  const onClickDelete = () => {

  }
  
  const optionProps = { name, setName, setError, data: items, setData: setItems, setDItems, setEdited };
  const siteProps = { data: sites, setData: setSites, setEdited };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true : false, id: 'mo_ac_btns' };
  const confirmProps = { open, text: t('page.back_confirm'), confirm };

  return (
    <Overlay className='i_container' loading={loading}>
      {open && <Confirm {...confirmProps} />}
      <div className='i_scroll'>
        {error && <Error1 error={error} />}
        <form>
          <CardOption {...optionProps} />
          <div className='gap' />
          {sites?.length ? <CardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}