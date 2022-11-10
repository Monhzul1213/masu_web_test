import React from 'react';

import '../../css/table.css';
import { Sort } from './Sort';

export function Table(props){
  const { tableInstance, onRowClick, noHeader } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      {!noHeader && <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let style = column?.customStyle ?? { };
              return (
                <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())} style={style}>
                  <div className='table_header_cell'>
                    <span style={{flex: 1}}>{column.render('Header')}</span>
                    {!column?.noSort && <Sort data={column} />}
                  </div>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>}
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'}  {...row.getRowProps()}>
              {row.cells.map(cell => {
                let style = cell?.column?.customStyle ?? { };
                return (
                  <td className='table_cell_text' {...cell.getCellProps()} style={style}
                    onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function TableRow(props){
  const { tableInstance, onRowClick, noHeader } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      {!noHeader && <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let style = column?.customStyle ?? { };
              return (
                <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())} style={style}>
                  <div className='table_header_cell'>
                    <span style={{flex: 1}}>{column.render('Header')}</span>
                    {!column?.noSort && <Sort data={column} />}
                  </div>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>}
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'}  {...row.getRowProps()}>
              {row.cells.map(cell => {
                let style = cell?.column?.customStyle ?? { };
                return (
                  <td className='table_cell_text' {...cell.getCellProps()} style={style}
                    onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function TableDetail(props){
  const { tableInstance, onRowClick, colSpan, Detail, detailName } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let style = column?.customStyle ?? { };
              return (
                <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())} style={style}>
                  <div className='table_header_cell'>
                    <span style={{flex: 1}}>{column.render('Header')}</span>
                    {!column?.noSort && <Sort data={column} />}
                  </div>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <>
              <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'}  {...row.getRowProps()}>
                {row.cells.map(cell => {
                  let style = cell?.column?.customStyle ?? { };
                  return (
                    <td className='table_cell_text' {...cell.getCellProps()} style={style}
                      onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {row?.isExpanded ?
                <tr colSpan={colSpan}><td colSpan={colSpan}>
                  <Detail data={row?.original && row?.original[detailName]} index={row?.index} />
                </td></tr>
              : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
}