import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getList, sendRequest } from '../../../../../services';
import { Date, DescrInput, Input, MoneyInput, Select } from '../../../../../components/all';
import { divide } from '../../../../../helpers';

export function Main(props){
  const { setError, setEdited, header, siteId, setSiteId, notes, setNotes, editable, packNo, setPackNo, date, setDate,
          type, setType, invt, setInvt, qty, setQty, cost, setCost, totalCost, setTotalCost, setDetail} = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [invts, setInvts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(header) onFocusSite();
    getInvts();
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

  const getInvts = async () => {
    // if(!categories?.length || categories?.length === 1 ){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
      if(response?.error) setError(response?.error);
      else {
        let invts = [];
        response?.data?.inventoryies?.forEach(item => {
          if(item?.msInventory?.isKit === 'Y'){
            invts.push(item?.msInventory)
          }})
        setInvts(invts)
      }
  }

  const onChangeInvt = value => {
    setInvt(value)
    getKitsInvt(value?.value)
  };

  const getKitsInvt = async(value) =>{
    let data = [{ fieldName: 'InvtID', value }, { fieldName: 'SiteID', value: siteId?.value }];
    const response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        item?.msInvKitItems?.forEach(list=> {
          list.lQty= list?.qty
          list.totalCost = divide(list?.qty, list?.cost, true)
        })
        setDetail(item?.msInvKitItems)
      })
    }
  }

  const onChangeQty = (value) =>{
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setQty({...value, error: 'must_number'});
    else setQty({ value: text });
    let sum = 0;
    setDetail(old => old.map((row, index) => {
      let qty = parseFloat(value?.value ? divide(old[index]?.lQty, value?.value, true) : old[index]?.lQty);
      let totalCost = divide(old[index]?.cost, qty , true);
      sum += totalCost;
      setTotalCost({value: sum});
      let cost = divide(sum, qty === 0 ? 1 : qty);
      setCost({value: cost});
      return { ...old[index], totalCost, qty};
    }))
  };

  const siteProps = { value: siteId, setValue: setSiteId, label: t('order.site'), placeholder: t('order.site'), data: sites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusSite, loading, disabled: !editable };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100, disabled: !editable };
  const noProps = { value: packNo, setValue: setPackNo, label: t('package.title'), placeholder: t('package.title'), inRow: true, disabled: true,  };
  const typeProps = { value: type, setValue: setType, label: t('discount.type'), placeholder: t('discount.type'), data: t('package.type'), setError, setEdited, inRow: true, disabled: !editable };
  // const statusProps = { value: status, setValue: setStatus, label: t('order.status'), placeholder: t('order.status'), data: t('package.status'), setError, setEdited, inRow: true, loading };
  const qtyProps = { value: qty, setValue: onChangeQty, label: t('order.t_qty1'), placeholder: t('order.t_qty1'), inRow: true, noBlur: true, disabled: !editable};
  const costProps = { value: cost, setValue: setCost, label: t('orders.cost'), placeholder: t('orders.cost'), inRow: true, disabled: true,  };
  const totalCostProps = { value: totalCost, setValue: setTotalCost, label: t('orders.totalCost'), placeholder: t('orders.totalCost'), inRow: true, disabled: true,  };
  const invtProps = { value: invt, setValue: onChangeInvt, label: t('coupon.invt'), setError, setEdited, inRow: true, disabled: siteId?.value ? !editable : true ,
  data: invts, s_value: 'invtId', s_descr: 'name', onFocus: getInvts, placeholder: t('coupon.invt_select')};
  const dateProps = { value: date, setValue: setDate, label: t('count.date'), placeholder: t('count.date'), inRow: true, className: 'c_date', disabled: !editable };

  return (
    <div className='ad_back'>
      <div className='ad_main'>
        <div className='ad_row'>
          <Input {...noProps}/>
          <div className='gap' />
          <div style={{marginTop: 0, flex: 1}}><Select {...siteProps} /></div>
        </div>
        <div className='ad_row'>
          <div style={{marginTop: 10, flex: 1}}><Select {...typeProps} /></div>
           <div className='gap' />
           <div style={{marginTop: 10, flex: 1}}><Select {...invtProps} /></div>
        </div>
        <div className='ad_row'>
          <div style={{marginTop: 10, flex: 1}}><Date {...dateProps} /></div>
          <div className='gap' />
          <div style={{marginTop: 10, flex: 1}}><Input {...qtyProps} /></div>
        </div>
        <div className='ad_row'>  
          <div style={{marginTop: 10, flex: 1}}><MoneyInput {...costProps} /></div>
          <div className='gap' />
          <div style={{marginTop: 10, flex: 1}}><MoneyInput {...totalCostProps} /></div>
        </div>
        <DescrInput {...descrProps} />
      </div>
    </div>
  );
}