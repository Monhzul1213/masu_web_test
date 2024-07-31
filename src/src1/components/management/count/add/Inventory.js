import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../../services';
import { ButtonRow, Overlay, Error, IconButton, Input, ModalTitle, Empty2, MultiCancelSelect, CheckBox } from '../../../all/all_m';
import { Select } from '../../../../../components/all';
import { InvtList } from './InvtList';
import '../../../../css/management.css';

export function Inventory(props){
  const { visible, closeModal, setItem, setVisible, item, siteId} = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [name, setName] = useState({ value: '' });
  const [site, setSite] = useState({ value: -1 });
  const [sites, setSites] = useState([]);  
  const [isRemain, setIsRemain] = useState(false);
  const [barCode, setBarCode] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [checked, setChecked] = useState(true);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusCategory();
    onFocusVendor();
    onFocusSite();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async query => {
      setLoading(true);
      let api = 'Inventory/SelectInventory' + query ?? '';
      let response = await dispatch(getList(user, token, api))
      if(response?.error) setError(response?.error);
      else 
      {
        response?.data?.forEach(list => {
          let check = item?.findIndex(it => it?.barCode === list?.barCode)
          if(check !== -1) list.checked = true
        })
        setData(response?.data);
      }
      setLoading(false);
      setChecked(false);
  }

  const onClickSave = () => {
    setLoading(true);
    let list = [];
    data?.forEach(li => { if(li?.checked) list.push(li)})
    if(!list?.length ) setError(t('count.no_data'))
    else {
      let li = []
      list?.forEach(l=> {
        l.name = l?.invtDescr
        l.countQty= l?.qty ? l?.qty : 0
        l.itemStatus = 0
        l.picountItemId= 0
        l.invtID = l?.invtId
        l.notes= ''
        let check = item?.findIndex(it => it?.barCode === l?.barCode)
        if(check === -1) li.push(l)
      })
      setItem(old => [...old, ...li])
      setVisible(false)
    }
    setLoading(false)
  }


  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError && setError(null);
      setLoading('site');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let datas = [];
        response?.data?.map(item => {
          if(item?.siteId === siteId?.value) datas.push(item)
        })
        let data = [...[{siteId: -1, name: t('pos.all')}], ...datas];
        setSites(data);
      }
      setLoading(null);
    }
  }

  const onFocusCategory = async () => {
    if(!categories?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        setCategories(response?.data);
        setCategory(response?.data?.map(item => item.categoryId));
      }     
      setLoading(false);
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


  // const onHide = () => {
  //   let query = '';
  //   if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteIDs=' + item);
  //   onSearch(query)
  // }

  const onClick = () => {
    let query = name?.value ? '?InvtDescr=' + name?.value : '?='
    if(vendor?.length !== vendors?.length) vendor?.forEach(item => query += '&VendID=' + item);
    if(category?.length !== categories?.length) category?.forEach(item => query += '&CategoryID=' + item);
    query += site?.value !== -1 ? '&SiteID=' + site?.value : '';
    query += isRemain ? '&IsBalance=' + 'Y' : ''
    query += barCode?.value ? '&BarCode=' + barCode?.value : ''
    onSearch(query);
  }

  const className = 'select_m', classLabel = 'count_select_lbl';
  const maxheight= 'calc(90vh - 105px )';
  const btnProps = { onClickCancel: () => closeModal(), onClickSave  };
  const searchProps = {text: t('page.search'), className: 'count_add_btn', onClick}
  const listProps = {checked, setChecked, data, setData}

  const nameProps = { value: name, setValue: setName, label: t('page.name'), setError, placeholder: t('page.name'), inRow: true  };
  const barcodeProps = { value: barCode, setValue: setBarCode, label: t('inventory.barcode'), setError, placeholder: t('inventory.barcode'), inRow: true };
  const remainProps = { label: t('manage.is_remain'), checked: isRemain, setChecked: setIsRemain, id: 'is_check2', inRow: true };

  // const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxCategory = category?.length === categories?.length ? t('inventory.all_category') : (category?.length + t('count.category'));
  const maxVendor = vendor?.length === vendors?.length ? t('order.all_vendor') : (vendor?.length + t('count.vendor'));

  const siteProps = { value: site, setValue: setSite, label: t('report_receipt.dr_site'), placeholder: t('report_receipt.dr_site'), 
                      data: sites, setError, s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusSite, loading, className, classBack: 'select_back', classLabel};
  const categoryProps = { value: category, setValue: setCategory, data: categories, s_value: 'categoryId', s_descr: 'categoryName', inRow: true,
            label: t('category.title'), onFocus: onFocusCategory, className, classBack: 'select_back', classLabel, maxTag: maxCategory, placeholder: t('count.category')};
  const vendorProps = { value: vendor, setValue: setVendor, data: vendors, s_value: 'vendId', s_descr: 'vendName', inRow: true,
            label: t('inventory.vendor'), onFocus: onFocusVendor, className, classBack: 'select_back', classLabel, maxTag: maxVendor, placeholder: t('count.vendor')};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={800}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdAllInbox' title={t('count.invt_add')} isMD={true} />
          <div style={{ overflowY: 'scroll', maxHeight: maxheight }}>
              <div className='count_row'>
                <Input {...nameProps} />
                <div className='gap'/>
                <Input {...barcodeProps} />
              </div>
              <div className='count_row'>
                <Select {...siteProps} />
                <div className='gap'/>
                <MultiCancelSelect {...categoryProps} />
              </div>
              <div className='count_row'>
                <MultiCancelSelect {...vendorProps} />
                <div className='gap'/>
                <div style={{flex: 1, display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
                  <CheckBox {...remainProps}/>
                  <div className='gap'/>
                  <IconButton {...searchProps}/>
                </div>
              </div>
          </div>
          {data?.length ? <InvtList {...listProps}/> : <Empty2 icon='MdAllInbox'/>}
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}