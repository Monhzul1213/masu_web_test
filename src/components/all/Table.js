import React from 'react';

import '../../css/table.css';
import { Sort } from './Sort';

export function Table(props){
  const { tableInstance, onRowClick } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
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
          return (
            <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'}  {...row.getRowProps()} onClick={() => onRowClick && onRowClick(row)}>
              {row.cells.map(cell => {
                return <td className='table_cell_text' {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}