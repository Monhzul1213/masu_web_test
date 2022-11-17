

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ButtonRowAdd, Confirm, Empty, Empty1, Error1, Overlay, PlainSelect } from '../../components/all/all_m';
import { List } from '../../components/invt/discount';
import { useSelector, } from 'react-redux';

export function Discount(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [site, setSite] = useState(-1);
  const [sites, ] = useState([{siteId: -1, name: t('pos.all')}]);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const { user }  = useSelector(state => state.login);

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectSite = value => {
    setSite(value);
    getData(value);
  }

  const getData = async siteid => {
    setError(null);

    setLoading(false);
  }

  const onFocusSite = async () => {

  }

  const onClickAdd = () => navigate('disc_add');

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      
    }
  };

  const siteProps = { value: site, setValue: onSelectSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'r_select',
    onFocus: onFocusSite, loading: loading === 'sites' };
  const listProps = { data, setData, setShow, checked, setChecked };
  const emptyProps = { icon: 'MdOutlineFactCheck', type: 'discount',   };
  const addProps = { type: 'discount', onClickAdd, show, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='s_container'>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading === 'loading'}>
        {error && <Error1 error={error} />}
        {!data?.length  ? <Empty {...emptyProps} /> :
          <div className='card_container'>
            <div className='i_list_header'>
              <ButtonRowAdd {...addProps} />
              <PlainSelect {...siteProps} />
            </div>
            {!data?.length ? <Empty1 {...emptyProps} /> :<List {...listProps} />}
          </div>
        }
      </Overlay>
    </div>
  )
}