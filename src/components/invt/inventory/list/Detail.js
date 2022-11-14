import React, { useState, useEffect } from 'react';
import { useTable, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';
import { TableRow } from '../../../all';
import { EditableCell } from '../add/EditableCell';
import { VariantEdit } from './VariantEdit';

export function Detail(props){
  const { data, index, updateData } = props;
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
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
    setVisible(true);
    setSelected(row?.original);
  }

  const onSave = async variant => {
    const response = await updateData(index, null, null, null, variant, true);
    return response;
  }

  const updateMyData = (row, column, value) => {
    let variant = {...data[row], rowStatus: 'U', cost: parseFloat(value ? value : 0)};
    updateData(index, null, null, null, variant, false, true)
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false, updateMyData }, useSortBy, useRowSelect);
  const tableProps = { tableInstance, onRowClick, noHeader: true };
  const maxHeight = 'calc(70vh)';
  const editProps = { visible, selected, onSave, setVisible };

  return (
    <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
      {visible && <VariantEdit {...editProps} />}
      <TableRow {...tableProps} />
    </div>
  )
}