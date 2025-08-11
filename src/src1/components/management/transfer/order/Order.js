import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../../../services';
import { ButtonRow, Overlay, Error, ModalTitle, Empty2, DynamicAIIcon } from '../../../all/all_m';
import { List } from './List';
import { Date, IconButton, Select } from '../../../../../components/all';
import { add } from '../../../../../helpers';

export function Order(props){
  const { visible, closeModal, setItem, setVisible, item, toSiteId, setToSiteId} = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(true);
  // const [site, setSite] = useState({ value: null });
  const [sites, setSites] = useState([]);
  const [beginDate, setBeginDate] = useState({ value: moment().subtract(1, 'days') });
  const [endDate, setEndDate] = useState({ value: moment() });
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onSearch = async query => {
    if(toSiteId?.value ){
      setLoading(true);
      let api = 'Sales/GetSalesHoldInfo' + query ?? '';
      let response = await dispatch(getList(user, token, api))
      if(response?.error) setError(response?.error);
      else {
        response?.data?.forEach(list => {
          let check = item?.findIndex(it => it?.invtId === list?.invtID)
          if(check !== -1) list.checked = true
        })
        setData(response?.data);
        }
        setLoading(false);
        setChecked(false);
    } else {
      if(!toSiteId?.value ) setToSiteId({ value: toSiteId?.value, error: t('error.not_empty') });
    }
  }

  
  const onClickSave = () => {
    setLoading(true);
    let list = [];
    data?.forEach(li => { if(li?.checked) list.push(li)})
    if(!list?.length ) setError(t('transfer.no_data'))
    else {
      let li = []
      list?.forEach(l=> {
        let check = item?.findIndex(it => it?.invtId === l?.invtID)
        if(check === -1) {
          l.qty = l?.orderQty
          l.invtId = l?.invtID
          l.rowStatus = "I"
          l.cost= 0
          l.totalCost= 0
          l.notes= ""
          l.leftQty = add(l?.siteQty, l?.orderQty, true )
          li.push(l)
        }
      })
      setItem(old => [...old, ...li])
      setVisible(false)
    }
    setLoading(false)
  }

  const onFocusSite = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setSites(response?.data);
    }
}

  const onClick = () => {
    let query = '?BeginDate=' + beginDate?.value?.format('yyyy.MM.DD') + '&EndDate=' + endDate?.value?.format('yyyy.MM.DD');
    query += '&SiteID=' + toSiteId?.value; 
    onSearch(query);
  }

  const btnProps = { onClickCancel: () => closeModal(), onClickSave  };
  const listProps = {checked, setChecked, data, setData}
  const emptyProps = { icon: 'MdSupervisorAccount' };
  
  const date1Props = { value: beginDate, setValue: setBeginDate, label: t('coupon.beginDate'), inRow: true  };
  const date2Props = { value: endDate, setValue: setEndDate, label: t('coupon.endDate'), inRow: true };
  const siteProps = { value: toSiteId, setValue: setToSiteId, label: t('transfer.sale_site'), placeholder: t('report_receipt.dr_site'), 
    data: sites, setError, //setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusSite, loading };
  // const searchProps = {text: t('page.search'), className: 'cou_add_btn', onClick}
  const searchProps = { className: 'ord_add_btn', onClick, icon: <DynamicAIIcon name = 'AiOutlineSearch'/>}

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={550}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineInventory' title={t('transfer.order_invt')} isMD={true} className='transfer_order'/>
          <Select {...siteProps} />
          <div className='ac_row' style={{marginTop: 20}}>
            <Date {...date1Props} />
            <div className='gap' />
            <Date {...date2Props} />
            <div className='gap' />
            <IconButton {...searchProps}/>
          </div>
          <div className='gap' />

          {data?.length ? <List {...listProps}/> : <Empty2 {...emptyProps}/>}
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}