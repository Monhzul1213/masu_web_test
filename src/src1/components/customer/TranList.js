import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';

import { Money, Table } from '../../../components/all';
import { config, encrypt } from '../../../helpers';


export function TranList(props){
  const { data, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('page.date'), accessor: 'salesDate', 
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      } },
      { Header: t('customer.salesNo'), accessor: 'salesNo', isBtn: true, customStyle: { maxWidth: 130 },
        Cell: ({ value, row, onClickLink }) => {
          return  (<div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(row)}>{value}</div>);
        }
      },
      { Header: t('report_receipt.dr_site'), accessor: 'siteName', customStyle: {width: 180}},
      { Header: t('customer.t_name'), accessor: 'custName',  },
      { Header: t('discount.type'), accessor: 'txnTypeName', customStyle: {width: 150}},
      { Header: <div style={{textAlign: 'right'}}>{t('discount.amount')}</div>, accessor: 'txnAmount',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
      { Header: t('shop.descr'), accessor: 'descr'}
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language,]);

  const onClickLink = (row) => {
    let msg = row?.original?.merchantId + '-' + row?.original?.siteId + '-' + row?.original?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 1000000 , sortBy: [{ id: 'salesDate', desc: true }]},
  onClickLink}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div >
      <div className='table_scroll' style={{overflow: 'scroll'}} >
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 720}}>
              <Table {...tableProps} />
        </div>
      </div>
      <p className='data_size_text'>{t('info.all') + data?.length}</p>
    </div>
  )
}