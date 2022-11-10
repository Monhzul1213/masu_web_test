import React, { useState, useEffect } from 'react';
import { useTable, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';
import { TableRow } from '../../../all';
import { EditableCell } from '../add/EditableCell';

export function Detail(props){
  const { data, index, updateData } = props;
  const [columns, setColumns] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const customStyle = { width: 40 };
    setColumns([
      { id: 'expander', noSort: true, customStyle, Header: '', Cell: '' },
      { id: 'check', noSort: true, customStyle, Header: '', Cell: '' },
      { Header: t('page.name'), accessor: 'variantName' },
      { id: 'category', noSort: true, Header: '', Cell: '', customStyle: { width: 240 } },
      {
        Header: t('inventory.price'), accessor: 'price', customStyle: { width: 100 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>
      },
      {
        Header: t('inventory.cost'), accessor: 'cost', customStyle: { width: 100 }, width: 80, isBtn: true,
        Cell: props => <EditableCell {...props} cellID='hide_border' />, isMoney: true
      },
      {
        Header: t('inventory.margin'), accessor: 'margin', customStyle: { width: 90 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onRowClick = row => {
    console.log(row?.original);
  }

  const updateMyData = (row, column, value) => {
    let invvar = data?.map((item, index) => {
      if(row === index) return {...item, rowStatus: 'U', cost: parseFloat(value ? value : 0)};
      return {...item, rowStatus: 'U'};
    });
    updateData(index, null, null, null, invvar)
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false, updateMyData }, useSortBy, useRowSelect);
  const tableProps = { tableInstance, onRowClick, noHeader: true };
  const maxHeight = 'calc(70vh)';

  return (
    <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
      <TableRow {...tableProps} />
    </div>
  )
}