import React from 'react';

import '../../css/table.css';
import { Sort } from './Sort';
import { FixedSizeList as VirtualList } from 'react-window';

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

export function TableDetailResize(props){
  const { tableInstance, onRowClick, Detail, detailName } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
    <table {...getTableProps()} className="table_back_resize">
      <thead style={{ position: "sticky", top: 0, alignSelf: "flex-start", zIndex: 1}}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className="table_header_text_resize" id={column.isResizing ? 'resizing_th' : ''} {...column.getHeaderProps()} style={{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth }}>
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
            <>
              <tr className='table_row_resize'  {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td className={'table_cell_text_resize'} {...cell.getCellProps()}
                      onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {row?.isExpanded ?
                <tr><td colSpan={headerGroups[0].headers.length}>
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
export function TableRowResize3(props){
  const { tableInstance, onRowClick, hasFooter } = props;

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, footerGroups } = tableInstance;
    const rowHeight = 40;
const maxRowsToShow = 10;
const visibleRows = Math.min(rows.length, maxRowsToShow);
const listHeight = visibleRows * rowHeight;

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
          <VirtualList
                height={listHeight}
                itemCount={rows.length}
                itemSize={rowHeight}
                width="100%"
              >
            {({ index, style }) => {
              const row = rows[index];
              prepareRow(row);
              return (
                 <tr className="table_row_resize" {...row.getRowProps({style})}>
                {row.cells.map((cell) => (
                  <td
                    className={`table_cell_text_resize ${cell.column.className || ''}`}
                    {...cell.getCellProps()}
                    onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
              );
            }}
          </VirtualList>
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
export function TableRowResize2(props) {
  const { tableInstance, onRowClick, hasFooter } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    footerGroups,
  } = tableInstance;
 
  const rowHeight = 30;
  const maxRowsToShow = 10;
  const visibleRows = Math.min(rows.length, maxRowsToShow);
  const listHeight = visibleRows * rowHeight;
 
  return (
    <div className="tablerowresize2_wrapper">
      <table
        {...getTableProps()}
        className="table_back_resize"
        style={{ width: 'max-content', tableLayout: 'auto' }}
      >
        <thead style={{ top: 0, zIndex: 1, position: 'sticky', background: 'var(--root-color)' }}>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr key={headerGroupIndex} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                const isHeaderText =
                  typeof column.Header === 'string' && column.Header.trim() !== '';
                const isLastHeaderGroup = headerGroupIndex === headerGroups.length - 1;
                const columnClass = column.className || '';
 
                const headerCellStyle =
                  headerGroupIndex === 2
                    ? {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isLastHeaderGroup ? 'center' : 'space-between',
                        width: '100%',
                      }
                    : headerGroupIndex <= 1
                    ? {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }
                    : {};
 
                const headerSpanStyle =
                  headerGroupIndex === 0 ? { fontSize: '14px' } : { fontSize: '11px' };
 
                const classList = [
                  'table_header_text_resize',
                  columnClass.includes('noBottomBorder') ? 'no-bottom-border' : '',
                  columnClass,
                ]
                  .filter(Boolean)
                  .join(' ');
 
                return (
                  <th
                    key={index}
                    className={classList}
                    id={column.isResizing ? 'resizing_th' : ''}
                    {...column.getHeaderProps()}
                  >
                    <div
                      className="table_header_cell"
                      {...column.getSortByToggleProps()}
                      style={{
                        ...headerCellStyle,
                        position: 'relative',
                        textAlign:
                          isLastHeaderGroup || headerCellStyle.justifyContent === 'center'
                            ? 'center'
                            : 'start',
                      }}
                    >
                      <span style={headerSpanStyle}>{column.render('Header')}</span>
                      {isLastHeaderGroup &&
                        isHeaderText &&
                        !column.disableSortBy &&
                        !column.noSort && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <Sort data={column} />
                          </div>
                        )}
                    </div>
 
                    {column.canResize &&
                      column.getResizerProps &&
                      !column.className?.includes('noResizer') && (
                        <div
                          {...column.getResizerProps()}
                          className="resizer1"
                          id={column.isResizing ? 'resizing' : ''}
                        />
                      )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
 
        <tbody className="table_body_back" {...getTableBodyProps()} style={{ position: 'relative', zIndex: 0 }}>
          <VirtualList height={listHeight} itemCount={rows.length} itemSize={rowHeight} width="100%">
            {({ index, style }) => {
              const row = rows[index];
              prepareRow(row);
              return (
                <tr className="table_row_resize" {...row.getRowProps({ style })}>
                  {row.cells.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`table_cell_text_resize ${cell.column.className || ''}`}
                      {...cell.getCellProps()}
                      onClick={() => !cell?.column?.isBtn && onRowClick && onRowClick(row)}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            }}
          </VirtualList>
        </tbody>
 
        {hasFooter && (
          <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 0 }}>
            {footerGroups.slice(0, -2).map((footerGroup) => {
              const renderedColumns = footerGroup.headers.map((column) => {
                try {
                  return typeof column.Footer === 'function'
                    ? column.render('Footer')
                    : column.Footer ?? '';
                } catch {
                  return '';
                }
              });
              const allEmpty = renderedColumns.every((c) => c == null || c === '');
              if (allEmpty) return null;
 
              return (
                <tr {...footerGroup.getFooterGroupProps()}>
                  {footerGroup.headers.map((column, idx) => (
                    <th
                      key={idx}
                      className="table_footer_text_o"
                      {...column.getFooterProps()}
                      style={{
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                      }}
                    >
                      {renderedColumns[idx]}
                    </th>
                  ))}
                </tr>
              );
            })}
          </tfoot>
        )}
      </table>
    </div>
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