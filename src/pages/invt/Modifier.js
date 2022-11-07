import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../../css/invt.css';
import { getList } from '../../services';
import { ButtonRowAdd, Confirm, Empty, Empty1, Error1, Overlay, PlainSelect } from '../../components/all';
import { List } from '../../components/invt/modifier';

export function Modifier(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // setFiltering(true);
    // setData([
    //   { modiferName: 'Decorated', optionName: 'Heart, Star' },
    //   { modiferName: 'Packed', optionName: 'Paper, Box' },
    //   { modiferName: 'Sealed', optionName: 'Waterproof' }
    // ]);
    return () => {};
  }, []);

  const onSelectSite = value => {
    setSite(value);
    getData(value);
  }

  const getData = async site => {

  }

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let sites1 = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(sites1);
      }
    }
  }

  const onClickAdd = () => navigate('modi_add');

  const onClickDelete = () => setOpen(true);

  const confirm = sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item.checked){
          toDelete?.push({...item, rowStatus: 'D'});
        }
      });
    }
  };

  const siteProps = { value: site, setValue: onSelectSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'r_select',
    onFocus: onFocusSite, loading: loading === 'sites' };
  const listProps = { data, setData, setShow };
  const emptyProps = { icon: 'MdOutlineFactCheck', type: 'modifier', onClickAdd };
  const addProps = { type: 'modifier', onClickAdd, show, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='s_container_mo'>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading === 'loading'}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
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