import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import useMeasure from "react-use-measure";

import '../../../../../css/table.css';
import { getList } from "../../../../../services";
import { Button, ButtonRow, CheckBox, Empty1, Error, Input1, ModalTitle, MultiSelect1, Overlay, PlainSelect1 } from "../../../../../components/all";
import { InvtList } from "./InvtList";

export function AddInventory(props){
  const { visible, setVisible, items, setItems, setError1, siteId, disabled } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [width, setWidth] = useState(180);
  const [barCode, setBarCode] = useState({ value: '' });
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [site, setSite] = useState(siteId?.value);
  const [sites, setSites] = useState([]);  
  const [isRemain, setIsRemain] = useState(false);
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState(true);
  const [ref, bounds] = useMeasure();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const pgWidth = bounds?.width;

  useEffect(() => {
    if(visible) onSearch();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    onFocusCategory();
    onFocusVendor();
    onFocusSite();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(pgWidth >= 710) setWidth((pgWidth - 70) / 4);
    else if(pgWidth < 710 && pgWidth >= 540) setWidth((pgWidth - 60) / 3);
    else if(pgWidth < 540) setWidth((pgWidth - 50) / 2);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pgWidth]);

  const onClickCancel = () => setVisible(false);

  const onFocusCategory = async () => {
    if(!categories?.length){
      setError(null);
      setLoading1(true);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        setCategories(response?.data);
        setCategory(response?.data?.map(item => item.categoryId));
      }     
      setLoading1(false);
    }
  }

  const onFocusVendor = async () => {
    if(!vendors?.length || vendors?.length === 1){
      setError && setError(null);
      setLoading('vendor');
      const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
      if(response?.error) setError && setError(response?.error);
      else {
        setVendors(response?.data);
        setVendor(response?.data?.map(item => item.vendId));
      }
      setLoading(null);
    }
  }

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError && setError(null);
      setLoading('site');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let datas = [];
        response?.data?.forEach(item => {
          if(item?.siteId === siteId?.value) datas.push(item)
        })
        let data = [...[{siteId: -1, name: t('pos.all')}], ...datas];
        setSites(data);
      }
      setLoading(null);
    }
  }

  const onSearch = async () => {
    let query = name?.value ? ('?InvtDescr=' + name?.value) : '?=';
    query += barCode?.value ? '&BarCode=' + barCode?.value : ''
    query += site !== -1 ? '&SiteID=' + site : '';
    query += isRemain ? '&IsBalance=' + 'Y' : '';
    if(category?.length !== categories?.length) category?.forEach(item => query += '&CategoryID=' + item);
    if(vendor?.length !== vendors?.length) vendor?.forEach(item => query += '&VendID=' + item);
    setLoading(true);
    setError(null);
    let response = await dispatch(getList(user, token, 'Inventory/SelectInventory' + query));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(list => {
        let check = items?.findIndex(it => it?.invtId === list?.invtId);
        if(check !== -1) list.checked = true;
      })
      setData(response?.data);
    }
    setLoading(false);
    setChecked(false);
  }

  const onClickSave = async () => {
    setLoading(true);
    let list = [];
    data?.forEach(li => { if(li?.checked) list.push(li); });
    if(!list?.length) setError(t('invoice.no_data'));
    else {
      setError(null);
      let li = [];
      list?.forEach(l=> {
        l.name = l?.invtDescr
        l.countQty= l?.qty ? l?.qty : 0
        l.siteQty= l?.qty ? l?.qty : 0
        l.origCost= l?.cost ? l?.cost : 0
        l.itemType= 'RC'
        l.qty = 0
        l.itemStatus = 0
        l.picountItemId= 0
        l.invtID = l?.invtId
        l.notes= ''
        l.rowStatus = 'I'
        l.status = 1
        let check = items?.findIndex(it => it?.barCode === l?.barCode)
        if(check === -1) li.push(l)
      })
      setItems(old => [...old, ...li]);
      setError1 && setError1(null);
      setVisible(false);
    }
    setLoading(false);
  }

  const selectProps = { setError, width, className: 'card_input' };
  const listProps = { data, setData, checked, setChecked };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={790} transitionName=''>
      <Overlay loading={loading}>
        <div className='m_back' ref={ref}>
          <ModalTitle icon='MdAllInbox' title={t('inventory.add')} isMD={true} />
          <div className="gap2" />
          <div style={{ overflowY: 'scroll', maxHeight: 'calc(90vh - 105px)' }}>
            <div className="filter_wrap">
              <Input1 {...selectProps}
                placeholder={t('page.name')}
                value={name}
                setValue={setName} />
              <Input1 {...selectProps}
                placeholder={t('inventory.barcode')}
                value={barCode}
                setValue={setBarCode} />
              <MultiSelect1
                classBack='filter_select_back'
                className='filter_select'
                width={width}
                value={category}
                setValue={setCategory}
                data={categories}
                placeholder={t('coupon.category_select')}
                label1={t('count.category')}
                loading={loading1}
                onFocus={onFocusCategory}
                s_value='categoryId' s_descr='categoryName' />
              <MultiSelect1
                classBack='filter_select_back'
                className='filter_select'
                width={width}
                value={vendor}
                setValue={setVendor}
                data={vendors}
                placeholder={t('order.all_vendor')}
                label1={t('count.vendor')}
                loading={loading1}
                onFocus={onFocusCategory}
                s_value='vendId' s_descr='vendName' />
              <PlainSelect1
                classBack='filter_select_back'
                className='filter_select'
                width={width}
                value={site}
                setValue={setSite}
                data={sites}
                placeholder={t('report_receipt.dr_site')}
                loading={loading1}
                onFocus={onFocusSite}
                disabled={disabled}
                s_value='siteId' s_descr='name' />
              <CheckBox
                label={ t('manage.is_remain')}
                checked={isRemain}
                setChecked={setIsRemain}
                style={{width: 180, margin: 0, padding: 5}}/>
              <Button
                text={t('page.search')}
                width={width}
                className='card_btn'
                onClick={onSearch} />
            </div>
            {error && <Error error={error} id='m_error' />}
            {data?.length ? <InvtList {...listProps}/> : <Empty1 icon='MdAllInbox' />}
          </div>
        </div>
        <ButtonRow text2='inventory.t_choose' onClickCancel={onClickCancel} onClickSave={onClickSave} /> 
      </Overlay>
    </Modal>
  );
}