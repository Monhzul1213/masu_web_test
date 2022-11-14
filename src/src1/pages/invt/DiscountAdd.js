import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/discount.css';
import { getList,  } from '../../services';
import { ButtonRow1, Confirm, Error1, Overlay } from '../../components/all/all_m';
import { Add , Site, CardEmpty} from '../../components/invt/discount';

export function DiscountAdd(){
  const [name, setName] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: '' });
  const [isEach, setIsEach] = useState({ value: 'Y' });
  const [sites, setSites] = useState([]);
  const [invt, setInvt] = useState(null);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getSites();
    setInvt(null); //if edit inventory
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        item.checked = true;
        item.rowStatus = 'I';
      });
      setSites(response?.data);
      return response?.data;
    }
  }


  const onClickCancel = () => {
    if(edited) setOpen(true);
    else navigate('/inventory/invt_discount');
  }

  const confirm = sure => {
    setOpen(false);
    if(sure) navigate('/inventory/invt_discount');
  }

  const onClickSave = async () => {
    
  }

  const onClickDelete = async () => {

  }

  const confirmProps = { open, text: t('page.back_confirm'), confirm };
  const mainProps = { setError, name, setName,  descr, setDescr, isEach, setIsEach,
  setEdited,  };
  const siteProps = {  data: sites, setData: setSites, setEdited };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: invt ? true : false };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add', id: 'mo_ac_back' };

  return (
    <Overlay className='i_container' loading={loading}>
      {open && <Confirm {...confirmProps} />}
      <div className='i_scroll'>
        {error && <Error1 error={error} />}
        <form className='form2'>
            <Add {...mainProps}/>
            <div className='gap' />
          {sites?.length ? 
          <Site {...siteProps} />  
           : <CardEmpty  {...siteEmptyProps}/>}
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}