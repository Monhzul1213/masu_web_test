import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getList } from '../../../../../services';
import { Date, DescrInput, IconButton, Select } from '../../../../../components/all';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export function Main(props){
  const { setError, setEdited, header, toSiteId, setToSiteId, fromSiteId, setFromSiteId, notes, setNotes, editable, date, setDate } = props;
  const { t } = useTranslation();
  const [fromSites, setFromSites] = useState([]);
  const [toSites, setToSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const disabled = detail?.length ? true : false;

  useEffect(() => {
    if(header){
      onFocusFromSite() 
      onFocusToSite();
    } else {
      onFocusToSite();

    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header]);

  const onFocusFromSite = async () => {
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let fromsite= []
        response?.data.forEach(item =>{
          if(item?.siteId !== toSiteId?.value){
            fromsite.push(item)
          }
          }
        )
        setFromSites(fromsite);
      }
  }

  const onFocusToSite = async () => {
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let tosite= []
        response?.data.forEach(item =>{
          if(item?.siteId !== fromSiteId?.value){
            tosite.push(item)
          }
          }
        )
        setToSites(tosite);
      }
  }

  const onClickBack = e => {
    e?.preventDefault();
    navigate('/management/transfer');
  }

  const fromSiteProps = { value: fromSiteId, setValue: setFromSiteId, label: t('transfer.from_site'), placeholder: t('report_receipt.dr_site'), data: fromSites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusFromSite, loading,  };
  const toSiteProps = { value: toSiteId, setValue: setToSiteId, label: t('transfer.to_site'), placeholder: t('report_receipt.dr_site'), data: toSites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusToSite, loading,  };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100, disabled: !editable };
  const dateProps = { value: date, setValue: setDate, label: t('count.date'), placeholder: t('count.date'), inRow: true, className: 'c_date', disabled: !editable };
  const backProps = { className: 'ps_back_btn', text: t('adjust.back1'), icon: <MdChevronLeft className='ps_back_icon' />, onClick: onClickBack };

  return (
    <div className='ad_back'>
      <div className='ps_menu_back'>
        <IconButton {...backProps} />
      </div>
      <div className='ad_main'>
        {header?.transferNo ? <p className='ps_header_no' style={{marginBottom: 10}}>{header?.transferNo}</p> : null}
        <div className='ac_row' style={{marginTop: 0}}>
          <Select {...fromSiteProps} />
          <div className='gap' />
          <Select {...toSiteProps} />
        </div>
        <div className='ac_row' style={{marginTop: 0}}>
          <div style={{marginTop: 20, flex: 1}}><Date {...dateProps} /></div>
          <div className='gap' />
          <div style={{marginTop: 0, flex: 1}}><DescrInput {...descrProps} /></div>
        </div>
      </div>
    </div>
  );
}