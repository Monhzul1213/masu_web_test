import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getService } from '../../../../services';
import { Input, Button, CheckBox, DescrInput } from '../../../all';

function Card(props){
  const { size, setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes, setNotes } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleEnter = async e => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    let api = 'http://192.168.1.107:3001/?regno=' + regNo?.value
    const response = await dispatch(getService(api));
    if(response?.error) setError(response?.error);
    else if(response?.data?.found){
      setName({ value: response?.data?.name });
      setChecked(response?.data?.vatpayer);
    } else {
      setError(t('tax.error'));
      setName({ value: '' });
      setChecked(false);
    }
    setLoading(false);
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const noProps = { value: regNo, setValue: setRegNo, label: t('tax.reg_no'), placeholder: t('tax.reg_no'), setError, setEdited, handleEnter, inRow: true };
  const btnProps = { className: 'co_check_btn', text: t('tax.check'), onClick: handleEnter};
  const nameProps = { value: name, setValue: setName, label: t('tax.name'), placeholder: t('tax.name'), inRow: true, disabled: true };
  const checkProps = { checked, setChecked, label: 'tax.checked', style: { marginTop: 0 }, disabled: true };
  const descrProps = { value: notes, setValue: setNotes, label: t('tax.note'), placeholder: t('tax.note'), disabled: true, inRow: true };
  
  return (
    <div className='add_back' id={id}>
      {/* {order?.orderNo && editing ? <p className='ps_header_no' style={{marginBottom: 10}}>{order?.orderNo}</p> : null} */}
      <div id={idRow} style={{marginTop: 0, flexFlow: 'row', alignItems: 'flex-end'}}>
        <Input {...noProps} />
        <div className='im_gap' />
        <Button {...btnProps} />
      </div>
      <div id={idRow} style={{flexFlow: 'column', marginTop: 15, marginBottom: 10}}>
        <Input {...nameProps} />
        <div className='im_gap' />
        <CheckBox {...checkProps} />
      </div>
      <DescrInput {...descrProps} />
    </div>
  );
}

/**
 * import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../../services';
import { Date, DescrInput, Select } from '../../../all';

function Card(props){
  const { setError, setEdited, vendId, setVendId, siteId, setSiteId, orderDate, setOrderDate, reqDate, setReqDate, notes, setNotes, size,
    setLoading, order, editing } = props;
  const [vendors, setVendors] = useState([]);
  const [sites, setSites] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(order){
      setVendId({ value: order?.vendId });
      setSiteId({ value: order?.siteId });
      setOrderDate({ value: moment(order?.orderDate, 'yyyy.MM.DD') });
      if(order?.reqDate) setReqDate({ value: moment(order?.reqDate, 'yyyy.MM.DD') });
      setNotes({ value: order?.notes });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const getData = async () => {
    let response = await getLists('Merchant/vendor/getvendor', setVendors);
    if(response) await getLists('Site/GetSite', setSites);
  }

  const getLists = async (api, setData) => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, api));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      setData(response?.data);
      return true;
    }
  }


  const vendProps = { value: vendId, setValue: setVendId, label: t('order.vend'), placeholder: t('order.vend'), data: vendors, setError, setEdited,
    s_value: 'vendId', s_descr: 'vendName', inRow: true, disabled: true };
  const siteProps = { value: siteId, setValue: setSiteId, label: t('order.site'), placeholder: t('order.site'), data: sites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true };
  const dateProps = { value: orderDate, setValue: setOrderDate, label: t('order.date'), setError, setEdited, inRow: true };
  const reqProps = { value: reqDate, setValue: setReqDate, label: t('order.req'), placeholder: t('order.req'), setError, setEdited,
    allowClear: true, inRow: true };

  return (
    <div className='po_back' id={id}>
      {order?.orderNo && editing ? <p className='ps_header_no' style={{marginBottom: 10}}>{order?.orderNo}</p> : null}
      <div id={idRow} style={{marginTop: 0}}>
        <Select {...vendProps} />
        <div className='im_gap' />
        <Select {...siteProps} />
      </div>
      <div id={idRow}>
        <Date {...dateProps} />
        <div className='im_gap' />
        <Date {...reqProps} />
      </div>
      <DescrInput {...descrProps} />
    </div>
  );
}
 */

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);