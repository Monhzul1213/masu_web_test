import React, { useEffect, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getList } from '../../../../services';
import { DescrInput, IconButton, Select } from '../../../all';

export function Main(props){
  const { setError, setEdited, header, detail, siteId, setSiteId, notes, setNotes, editable } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const disabled = detail?.length ? true : false;

  useEffect(() => {
    if(header) onFocusSite();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header]);

  const onFocusSite = async () => {
    if(!sites?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else setSites(response?.data);
    }
  }

  const onClickBack = e => {
    e?.preventDefault();
    navigate('/management/adjust');
  }

  const siteProps = { value: siteId, setValue: setSiteId, label: t('order.site'), placeholder: t('order.site'), data: sites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusSite, loading, disabled };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100, disabled: !editable, inRow: true };
  const backProps = { className: 'ps_back_btn', text: t('adjust.back'), icon: <MdChevronLeft className='ps_back_icon' />, onClick: onClickBack };

  return (
    <div className='ad_back'>
      <div className='ps_menu_back'>
        <IconButton {...backProps} />
      </div>
      <div className='ad_main'>
        {header?.adjustNo ? <p className='ps_header_no' style={{marginBottom: 10}}>{header?.adjustNo}</p> : null}
        <div className='ad_row'>
          <div style={{marginTop: 0, flex: 1}}><Select {...siteProps} /></div>
           <div className='gap' />
          <DescrInput {...descrProps} />
        </div>
      </div>
    </div>
  );
}