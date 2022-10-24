import React from 'react';

export function Table(props){
  return (
    <div>
      Table
    </div>
  );
}

/**
 * import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import '../../css/table.css';
import { formatNumber } from '../../helpers';
import { Pagination, Sort } from '../all';

export function Table(props){
  const { t, i18n } = useTranslation();
  const { data, setVisible, selected, setSelected } = props;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('table.barcode'), accessor: 'BarCode' },
      { Header: t('table.category'), accessor: 'CategoryName' },
      { Header: t('table.name'), accessor: 'Descr' },
      { Header: <div style={{textAlign: 'center'}}>{t('table.price')}</div>, accessor: 'UnitPrice', 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div>
      },
      { Header: t('table.status'), accessor: 'TranStatusName' },
    ]);
    return () => {};
  }, [i18n?.language]);

  useEffect(() => {
    if(!selected){
      toggleAllRowsSelected(false);
    }
    return () => {};
  }, [selected]);

  const onRowClick = row => {
    toggleAllRowsSelected(false);
    row?.toggleRowSelected();
    setVisible(true);
    setSelected(row?.original);
  }

  const tableInstance = useTable( { columns, data, initialState: { pageIndex: 0, pageSize: 100 }}, useSortBy, usePagination, useRowSelect);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, toggleAllRowsSelected } = tableInstance;

  return (
    <div className='page_back'>
      <div className='table_container'>
        <table className='table_back' {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div className='table_header_cell'>
                      <span style={{flex: 1}}>{column.render('Header')}</span>
                      <Sort data={column} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='table_body_back' {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              let style = row?.original?.HexColor ? {backgroundColor: row?.original?.HexColor, borderColor: '#fff'} : {};
              return (
                <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'} style={style} {...row.getRowProps()} onClick={() => onRowClick(row)}>
                  {row.cells.map(cell => {
                    return <td className='table_cell_text' {...cell.getCellProps()} style={style}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pagination tableInstance={tableInstance} hasTotal={true} total={data?.length} />
    </div>
  )
}
 */