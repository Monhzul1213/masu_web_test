import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import { getList } from '../../../../services';
import { add, divide } from '../../../../helpers';
import { Date, DescrInput, MoneyInput, Select } from '../../../all';

function Card(props){
  const { setError, setEdited, vendId, setVendId, siteId, setSiteId, orderDate, setOrderDate, reqDate, setReqDate, notes, setNotes, size,
    setLoading, order, editing, payType, setPayType, total, isOTC, setIsOTC, otcInfo, setOtcInfo, totals, setTotals, discount, setDiscount } = props;
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [sites, setSites] = useState([]);
  const [otcPayments, setOtcPayments] = useState([]);
  const [otcDates, setOtcDates] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(vendId?.value) getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendId?.value]);

  useEffect(() => {
    let disc = divide(divide(discount, total, true), 100);
    let to_pay = add(total, disc, true);
    setTotals({ discount: disc, to_pay });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, discount]);

  useEffect(() => {
    if(order){
      setVendId({ value: order?.vendId });
      setSiteId({ value: order?.siteId });
      setOrderDate({ value: moment(order?.orderDate) });
      if(order?.reqDate) setReqDate({ value: moment(order?.reqDate, 'yyyy.MM.DD') });
      setNotes({ value: order?.notes });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const getData = async () => {
    let response = await getSites();
    if(response) await getVendors();
  }

  const getSites = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      setSites(response?.data);
      return true;
    }
  }

  const getVendors = async () => {
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
    if(response?.error) setError(response?.error);
    else {
      setVendors(response?.data);
      let vendor = response?.data?.filter(d => d?.vendId === vendId?.value)[0];
      await getOTC(vendor);
    }
    setLoading(false);
  }

  const getOTC = async vendor => {
    if(vendor?.useOtcorder === 'Y'){
      setIsOTC(true);
      let api = 'Txn/GetVendorOTC?VendiID=' + vendor?.vendId + '&VendorCustID=' + vendor?.vendorCustId + '&VendSalesRepID=' + vendor?.vendSalesRepId;
      let response = await dispatch(getList(user, token, api));
      if(response?.error) setError(response?.error);
      else {
        let info = response?.data?.info && response?.data?.info[0];
        let dates = info?.requestDates?.split(',')?.sort((a, b) => a?.localeCompare(b))?.map(i => { return { label: i, value: i }});
        let payments = response?.data?.paymenttype ?? [];
        setOtcInfo(info);
        setOtcPayments(payments);
        setOtcDates(dates);
        if(order){
          setReqDate({ value: order?.reqDate });
          let payID = parseInt(order?.orderPayment ? order?.orderPayment : 0);
          let discount = payments?.filter(p => p.paymentTypeID === payID)[0]?.discountPercent;
          setDiscount(discount);
          setPayType({ value: payID });
        } else {
          setPayType({ value: payments && payments[0]?.paymentTypeID });
          let discount = (payments && payments[0]?.discountPercent) ?? 0;
          setDiscount(discount);
          setReqDate(dates && dates[0]);
        }
      }
    } else {
      setIsOTC(false);
    }
  }

  const changeType = value => {
    let disPercent = (otcPayments?.filter(i => i.paymentTypeID === value?.value)[0]?.discountPercent) ?? 0;
    setPayType(value);
    setDiscount(disPercent);
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';

  const vendProps = { value: vendId, setValue: setVendId, label: t('order.vend'), placeholder: t('order.vend'), data: vendors, setError, setEdited,
    s_value: 'vendId', s_descr: 'vendName', inRow: true, disabled: true };
  const siteProps = { value: siteId, setValue: setSiteId, label: t('order.site'), placeholder: t('order.site'), data: sites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true };
  const dateProps = { value: orderDate, setValue: setOrderDate, label: t('order.date'), setError, setEdited, inRow: true };
  const reqProps = { value: reqDate, setValue: setReqDate, label: t('order.req'), placeholder: t('order.req'), setError, setEdited,
    allowClear: true, inRow: true };
  const reqOtcProps = { value: reqDate, setValue: setReqDate, label: t('order.req'), placeholder: t('order.req'), data: otcDates, setError, setEdited,
    inRow: true };
  const payProps = { value: payType, setValue: changeType, label: t('order.payment'), placeholder: t('order.payment'), data: otcPayments, setError, setEdited,
    s_value: 'paymentTypeID', s_descr: 'paymentTypeName', inRow: true };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100 };

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
        {isOTC ? <Select {...reqOtcProps} /> : <Date {...reqProps} />}
      </div>
      {!isOTC ? null :
        <>
          <div id={idRow}>
            <MoneyInput label={t('order.ar_amount')} value={{ value: otcInfo?.arAmount ?? 0}} disabled={true} inRow={true} />
            <div className='im_gap' />
            <Select {...payProps} />
          </div>
          <div id={idRow}>
            <MoneyInput label={t('order.total')} value={{ value: total}} disabled={true} inRow={true} />
            <div className='im_gap' />
            <MoneyInput label={t('order.discount')} value={{ value: totals?.discount }} disabled={true} inRow={true} />
          </div>
          <div id={idRow}>
            <MoneyInput label={t('order.to_pay')} value={{ value: totals?.to_pay }} disabled={true} inRow={true} />
            <div className='im_gap' />
            <div style={{flex: 1}} />
          </div>
        </>
      }
      <DescrInput {...descrProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);