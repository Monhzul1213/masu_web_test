import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty, Error1, Overlay, PlainSelect } from '../../components/all';
import { List } from '../../components/invt/modifier';

export function Modifier(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([]);
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onSelectSite = value => {
    setSite(value);
    // getData(value);
  }

  const onFocusSite = async () => {
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

  const onClickAdd = () => {
    
  }

  const siteProps = { value: site, setValue: onSelectSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'r_select',
    onFocus: onFocusSite, loading: loading === 'sites' };
  const listProps = { };
  const emptyProps = { icon: 'MdOutlineFactCheck', type: 'modifier', onClickAdd };

  return (
    <div className='s_container_mo'>
      {/* {visible && <Add {...addProps} />} */}
      <Overlay loading={loading === 'loading'}>
        {error && <Error1 error={error} />}
        {data?.length ? <List {...listProps} /> : <Empty {...emptyProps} />}
        <div className='pos_select'><PlainSelect {...siteProps} /></div>
      </Overlay>
    </div>
  )
}