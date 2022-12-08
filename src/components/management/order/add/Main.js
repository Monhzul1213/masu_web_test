import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getList } from '../../../../services';
import { Date, DescrInput, Select } from '../../../all';

function Card(props){
  const { setError, setEdited, vendId, setVendId, siteId, setSiteId, orderDate, setOrderDate, reqDate, setReqDate, notes, setNotes, size,
    setLoading } = props;
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [sites, setSites] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';

  const vendProps = { value: vendId, setValue: setVendId, label: t('order.vend'), placeholder: t('order.vend'), data: vendors, setError, setEdited,
    s_value: 'vendId', s_descr: 'vendName', inRow: true };
  const siteProps = { value: siteId, setValue: setSiteId, label: t('order.site'), placeholder: t('order.site'), data: sites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true };
  const dateProps = { value: orderDate, setValue: setOrderDate, label: t('order.date'), setError, setEdited, inRow: true };
  const reqProps = { value: reqDate, setValue: setReqDate, label: t('order.req'), placeholder: t('order.req'), setError, setEdited,
    allowClear: true, inRow: true };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100 };

  return (
    <div className='po_back' id={id}>
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

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);