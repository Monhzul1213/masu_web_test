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
      </thead>}
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          let style = row?.original?.row_color ? {backgroundColor: row?.original?.row_color, borderColor: '#fff'} : {};
          prepareRow(row);
          return (
            <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'} style={style} {...row.getRowProps()}>
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

export function TableRow(props){
  const { tableInstance, onRowClick, noHeader, scrolling, hasFooter } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, footerGroups } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      {!noHeader && <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let style = column?.customStyle ?? { };
              let style1 = column?.isSorted11 ? { color: '#8cc748', flex: 1 } : { flex: 1};
              return (
                <th className={scrolling ? 'table_header_text1' : 'table_header_text'}
                  {...column.getHeaderProps(column.getSortByToggleProps())} style={style}>
                  <div className='table_header_cell'>
                    <span style={style1}>{column.render('Header')}</span>
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
      {hasFooter && <tfoot>
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
    </table>
  );
}

export function TableResize(props){
  const { tableInstance, onRowClick } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

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
    </table>
  );
}

export function TableRowResize(props){
  const { tableInstance, onRowClick, hasFooter } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, footerGroups } = tableInstance;

  return (
    <table {...getTableProps()} className="table_back_resize">
      <thead style={{ position: "sticky", top: 0, alignSelf: "flex-start", zIndex: 1}}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className="table_header_text_resize" id={column.isResizing ? 'resizing_th' : ''} {...column.getHeaderProps()}>
                <div className='table_header_cell' {...column.getSortByToggleProps()}>
                  <span style={{flex: 1}}>{column.render("Header")}</span>
                  {!column?.noSort && <Sort data={column} />}
                </div>
                <div {...column.getResizerProps()} className='resizer' id={column.isResizing ? 'resizing' : ''} />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='table_body_back' {...getTableBodyProps()} style={{ position: "relative", zIndex: 0 }}>
        {rows.map((row, i) => {
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

export function FooterTable(props){
  const { tableInstance, onRowClick, noHeader, hasFooter } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, footerGroups  } = tableInstance;

  return (
    <table className='table_back' {...getTableProps()}>
      {!noHeader && <thead>
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
      </thead>}
      <tbody className='table_body_back' {...getTableBodyProps()}>
        {page.map((row, i) => {
          let style = row?.original?.row_color ? {backgroundColor: row?.original?.row_color, borderColor: '#fff'} : {};
          prepareRow(row);
          return (
            <tr className={row?.isSelected ? 'table_row_selected' : 'table_row'} style={style} {...row.getRowProps()}>
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