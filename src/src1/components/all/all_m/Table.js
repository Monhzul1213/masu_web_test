import React from 'react';
import '../../../../css/table.css';
import { Sort } from './Sort';

export function NoHeaderTable(props){
  const { tableInstance, onRowClick } = props;

  const { getTableProps, getTableBodyProps, prepareRow, page } = tableInstance;

  return (
    <table className='tm_table_back' {...getTableProps()}>
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr className={row?.isSelected ? 'tm_table_row_selected' : 'tm_table_row'}  {...row.getRowProps()}>
              {row.cells.map(cell => {
                let style = cell?.column?.customStyle ?? { };
                return (
                  <td className='tm_table_cell_text' {...cell.getCellProps()} style={style}
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

export function NoHeaderTable1(props){
  const { tableInstance, onRowClick, colSpan, Detail, detailName } = props;

  const { getTableProps, getTableBodyProps, prepareRow, page } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <>
              <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'}  {...row.getRowProps()}>
                {row.cells.map(cell => {
                  let style = cell?.column?.customStyle ?? { };
                  return (
                    <td className='table_cell_text1' {...cell.getCellProps()} style={style}
                      onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {row?.open ?
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

export function TableText(props){
  const { tableInstance, onRowClick, colSpan, detailName } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
    <table className='table_back1' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let style = column?.customStyle ?? { };
              let style1 = column?.isSorted11 ? { color: '#8cc748', flex: 1 } : { flex: 1};
              return (
                <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())} style={style}>
                  <div className='table_header_cell'>
                    <span style={style1}>{column.render('Header')}</span>
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
                    <td className='table_cell_text1' {...cell.getCellProps()} style={style}
                      onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {row?.original?.ratingText ?
              <tr colSpan={colSpan}><td colSpan={colSpan}>
                <p className='table_detail_text'>{'Санал хүсэлт: '}{row?.original[detailName]}</p>                
              </td></tr>
              : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
}

export function TableDetail(props){
  const { tableInstance, onRowClick, colSpan, Detail, detailName, hasFooter } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, footerGroups } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let style = column?.customStyle ?? { };
              let style1 = column?.isSorted11 ? { color: '#8cc748', flex: 1 } : { flex: 1};
              return (
                <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())} style={style}>
                  <div className='table_header_cell'>
                    <span style={style1}>{column.render('Header')}</span>
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
                    <td className='table_cell_text1' {...cell.getCellProps()} style={style}
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
      {hasFooter && <tfoot style={{ position: "sticky", bottom: 0, alignSelf: "flex-end", zIndex: 0}}>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <th className='table_footer_text_o' {...column.getFooterProps()}>{column.render('Footer')}</th>
            ))}
          </tr>
        ))}
      </tfoot>}
    </table>
  );
}