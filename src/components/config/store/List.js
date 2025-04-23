import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { PaginationTable, Table } from '../../all';
// import { SubscriptionSite } from '../../management/adjust/list';

export function List(props){
  const { data, onClickAdd } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  // const [visible, setVisible] = useState(false);
  // const [site, setSite] = useState(null);

  useEffect(() => {
    setColumns([
      { Header: t('shop.t_name'), accessor: 'name' },
      { Header: t('shop.t_addr'), accessor: 'address_text' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('shop.t_pqty')}</div>, accessor: 'posQty',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value}</div>
      }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  // const onClickLink = row => {
  //   setVisible(true);
  //   setSite(row?.original);
  // }

  // const onDone = () => {
  //   setVisible(false);
  //   setSite(null);
  //   getData();
  // }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  // const subProps = { visible, setVisible, site, onDone, noTrial: true, noBack: true, fromSite: true }; 

  return (
    <div>
      {/* {visible && <SubscriptionSite {...subProps} />} */}
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 540}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}