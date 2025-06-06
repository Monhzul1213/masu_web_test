import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Empty1, FooterTable, Money } from '../../../../components/all';
import { Detail } from './Detail';
import { getList } from '../../../../services';
import { EditableCell } from './EditableCell';
import { Header } from './Header';

export function List(props){
  const { data, size, setError, onSearch , filter, period } = props;
  const [columns, setColumns] = useState([]);
  const [detail, setDetail] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns1, setColumns1] = useState([]);
  const { t, i18n } = useTranslation();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();


  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 57px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 10px )');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  useEffect(() => {
    changeColumns(['siteQty','subAmount', 'totalSales', 'createdDate', 'partnerCode', 'adsTypeName'], period);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, period, data]);


  const changeColumns = (value) => {
    let columns = [
      { Header: <div style={{textAlign: 'right'}}>{t('system.id')}</div>, accessor: 'merchantID',
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)      },
      { Header: t('info.type'), accessor: 'classname' , customStyle: { minWidth: 90 }, Footer: 'Нийт: ' + data?.length},
      { Header: t('info.subtype'), accessor: 'subclassname' , customStyle: { minWidth: 130 }},
      { Header: t('tax.customer'), accessor: 'customer' , customStyle: { minWidth: 150 }},
      { Header: t('invoices.batch'), accessor: 'subscriptionType' , customStyle: { minWidth: 70 }},
      { Header: t('employee.password'), accessor: 'user1' , customStyle: { minWidth: 100 },
        Cell: props => <div style={{ paddingRight: 15}}><EditableCell {...props} /></div>},
       ];
    setColumns1(value);
    t('info.columns')?.forEach(item => {
      let exists = value?.findIndex(val => val === item?.value) !== -1;
      if(exists){
        columns.push({
          Header: <div style={item?.value === 'createdDate' ? {textAlign: 'left'} : {textAlign: 'right'}}>{item?.label}</div>, accessor: item?.value,
          width: 130, minWidth: 100,
          exLabel: item?.label,
          Cell: props => (
            item?.value === 'createdDate' ? moment(props?.value)?.format('yyyy.MM.DD') :
            <div style={{textAlign: 'right', paddingRight: 15}}>
             {item?.value === 'subAmount' ? ( <Money value={props?.value} fontSize={14} />) : 
              item?.value === 'useNuatus' ? (props?.value === "Y" ? t('page.yes') : t('page.no')) : 
              item?.value === 'totalSales' ? (<div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => props?.onClickLink(props?.row)}><Money value={props?.value} fontSize={14} /></div>) : props?.value
             } 
             </div>
            ),
          Footer: info => {
            let totalSubAmt = data.reduce((sum, { subAmount }) => sum += subAmount, 0);
            let totalSales = data.reduce((sum, { totalSales }) => sum += totalSales, 0);
            let totalSiteQty = data.reduce((sum, { siteQty }) => sum += siteQty, 0);
            let totalTerQty = data.reduce((sum, { terminalQty }) => sum += terminalQty, 0);
            let totalEmpQty = data.reduce((sum, { empQty }) => sum += empQty, 0);
            let totalsubQty = data.reduce((sum, { subQty }) => sum += subQty, 0);
            let totalsalesQty = data.reduce((sum, { salesQty }) => sum += salesQty, 0);
            return <> 
              <div style={{textAlign: 'right', paddingRight: 15}}>
                {item?.value === 'subAmount' ? <Money value= {totalSubAmt}/> : 
                 item?.value === 'totalSales' ? <Money value= {totalSales}/> :
                 item?.value === 'siteQty' ? totalSiteQty : 
                 item?.value === 'terminalQty' ? totalTerQty : 
                 item?.value === 'empQty' ? totalEmpQty :
                 item?.value === 'subQty' ? totalsubQty :
                 item?.value === 'salesQty' ? totalsalesQty :''}
              </div></>
            }
        });
      }
    });
    setColumns(columns);
  }
  
    
  const onClickLink = async (row) => {
    setVisible(true);
    setLoading(true);
    let query = row?.original?.merchantID;
    let api = 'Merchant/GetMerchantSales?merchantid=' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    response?.data?.forEach(item => {
      item.merchantID = row?.original?.merchantID;
    })
    // if(response?.error) setError(response?.error);
    setDetail(response?.data);
    setLoading(false);
  }

  const closeModal = () => {
    setVisible(false);
  };
  
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'merchantID', desc: true }] }, onClickLink}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasFooter: true };
  let detailProps = { data : detail, visible, closeModal, loading};
  const headerProps = {size, setError, onSearch , filter, data, value: columns1, setValue: changeColumns, data1: t('info.columns'), className1: 'rp_list_drop'};
  const emptyProps = { icon: 'MdReceipt', type: 'time', noDescr: true };

  return (
    <div>
      {visible && <Detail {...detailProps} />}
      <Header {...headerProps}/>
      {!data?.length ? <Empty1 {...emptyProps} /> : 
      <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', overflowX: 'scroll', maxHeight, minWidth: 400}}>
        <FooterTable {...tableProps} />
      </div>}
    </div>
  );
}