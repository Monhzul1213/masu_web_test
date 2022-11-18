import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonRowAddConfirm, MultiSelect } from '../../all';

export function Header(props){
  const { onClickAdd, show, onClickDelete, onSearch } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);

  const onFocusSite = async () => {
    // if(!sites?.length || sites?.length === 1){
    //   setError && setError(null);
    //   setLoading(true);
    //   const response = await dispatch(getList(user, token, 'Site/GetSite'));
    //   if(response?.error) setError && setError(response?.error);
    //   else {
    //     let data = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
    //     setSites(data);
    //   }
    //   setLoading(false);
    // }
  }

  const onChangeSite = value => {
    setSite(value);
    // let api = '?SiteID=' + value;
    // onSearch(api);
  }

  const addProps = { type: 'time', onClickAdd, show, onClickDelete };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites' };

  return (
    <div className='i_list_header'>
      <ButtonRowAddConfirm {...addProps} />
      <div className='i_list_header1'>
        <MultiSelect {...siteProps} />
      </div>
      {/*
        <DynamicAIIcon {...searchProps} />
      */}
    </div>
  );
}