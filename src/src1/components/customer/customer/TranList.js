import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';

import { Empty1, Money, PlainRange, FooterTable } from '../../../../components/all';
import { ExportExcel, config, encrypt } from '../../../../helpers';


export function TranList(props){
  const { data, size, date, setDate, onSearch, selected} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('page.date'), accessor: 'salesDate', exLabel: t('page.date'),
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }, Footer: t('info.all') + data?.length},
      { Header: t('customer.salesNo'), accessor: 'salesNo', isBtn: true, customStyle: { maxWidth: 130 }, exLabel: t('customer.salesNo'),
        Cell: ({ value, row, onClickLink }) => {
          return  (<div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(row)}>{value}</div>);
        }
      },
      { Header: t('report_receipt.dr_site'), accessor: 'siteName', exLabel: t('report_receipt.dr_site'), customStyle: {width: 180}},
      { Header: t('customer.t_name'), accessor: 'custName',  exLabel:t('customer.t_name')},
      { Header: t('discount.type'), accessor: 'txnTypeName', customStyle: {width: 150}, exLabel: t('discount.type') },
      { Header: <div style={{textAlign: 'right'}}>{t('discount.amount')}</div>, accessor: 'txnAmount', exLabel: t('discount.amount') ,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
      { Header: t('shop.descr'), accessor: 'descr', exLabel:t('shop.descr')}
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

  const onClickLink = (row) => {
    let msg = row?.original?.merchantId + '-' + row?.original?.siteId + '-' + row?.original?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

  const onHide = () => {
    let query= '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD') + '&custId=' + selected?.custId;
    onSearch(query);
  }

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 1000000 , sortBy: [{ id: 'salesDate', desc: true }]},
  onClickLink}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasFooter: true };
  const exportProps = { text: t('page.export'), columns: columns, excelData: data, fileName: t('system.cus_trans'), className: 'rp_list_select1'};
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide, className: 'rh_date'};

  return (
    <div >
        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <PlainRange {...dateProps} />
          <ExportExcel {...exportProps} />
        </div>
      <div style={{overflowX: 'scroll'}} >
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth : 320}}>
            {data?.length ? <FooterTable {...tableProps} /> : <Empty1/>} 
        </div>
      </div>
      {/* <p className='data_size_text'>{t('info.all') + data?.length}</p> */}
    </div>
  )
}