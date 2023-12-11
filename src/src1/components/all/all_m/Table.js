import React from 'react';
import '../../../../css/table.css';
import { Sort } from './Sort';
     
export function Table(props){
  const { tableInstance, onRowClick } = props;

  const { getTableProps, getTableBodyProps, headerGroups,  prepareRow, page } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())}>
                <div className='table_header_cell'>
                  <span style={{flex: 1}}>{column.render('Header')}</span>
                  {!column?.noSort && <Sort data={column} />}
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
          );
        })}
      </tbody>
    </table>
  );
}

export function FooterTable(props){
  const { tableInstance, onRowClick } = props;

  const { getTableProps, getTableBodyProps, headerGroups, footerGroups,  prepareRow, page } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className='table_header_text' {...column.getHeaderProps(column.getSortByToggleProps())}>
                <div className='table_header_cell'>
                  <span style={{flex: 1}}>{column.render('Header')}</span>
                  {!column?.noSort && <Sort data={column} />}
                </div>
                <div className='resizer1' />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
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
          );
        })}
      </tbody>
      <tfoot>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <th className='table_footer_text' {...column.getFooterProps()}>{column.render('Footer')}</th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}
export function TableResize(props){
  const { tableInstance, onRowClick } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, footerGroups } = tableInstance;

  return (
    <table {...getTableProps()} className="table_back_resize">
      <thead style={{ position: "sticky", top: 0, alignSelf: "flex-start", zIndex: 1}}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className="table_header_text_resize" id={column.isResizing ? 'resizing_th' : ''} {...column.getHeaderProps()}>
                <div className='table_header_cell' {...column.getSortByToggleProps()}>
                  <span style={{flex: 1}} className='table_header_cell_resize'>{column.render("Header")}</span>
                  {!column?.noSort && <Sort data={column} />}
                </div>
                <div {...column.getResizerProps()} className='resizer' id={column.isResizing ? 'resizing' : ''} />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='table_body_back' {...getTableBodyProps()} style={{ position: "relative", zIndex: 0 }}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr className='table_row_resize' {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td className='table_cell_text_resize' {...cell.getCellProps()} onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot style={{ position: "sticky", bottom: 0, alignSelf: "flex-end", zIndex: 0}}>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <th className='table_footer_text' {...column.getFooterProps()}>{column.render('Footer')}</th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

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
  const { tableInstance, onRowClick, colSpan, Detail, detailName, open } = props;

  const { getTableProps, getTableBodyProps, prepareRow, page } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          // console.log(row?.open)
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
