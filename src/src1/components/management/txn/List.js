import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';
import { Empty1, TableRowResize2, Money } from '../../../../components/all';
import { formatNumber } from '../../../../helpers';
import { min } from 'moment';
export function List(props) {
  const { data, setData, excelName, setError, onSearch, size, columns, setColumns } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
  setColumns([
    {
      Header: '\u200B', 
      accessor: 'example',
      canResize: true,
      className: 'noBottomBorder noResizer',
      columns :[
        {
          Header: '\u200B', 
          accessor: 'example',
          canResize: true,
          columns :[
            {
              Header: t('system_menu.store'),
              
              accessor: 'siteName',
              Footer: () => t('report.total') + ' ' + data?.length,
              width: 110,
              minWidth: 90
            },
            {
              Header: t('menu.invt_category'),
              accessor: 'categoryName',
              Footer: '',
              width: 110,
              minWidth: 90
            },
            {
              Header: t('menu.inventory'),
              accessor: 'itemName',
              Footer: '',
              width: 130,
              minWidth: 110,
            },
            {
              Header: t('inventory.barcode'),
              accessor: 'barCode',
              Footer: '',
              width: 110,
              minWidth: 80
            }
    
          ]
        }]
    },
    {
      Header: '\u200B', 
      accessor: 'example2',
      canResize: true,
      // className: 'extend-resizer-up',
      className: 'noResizer',
      columns :[
        {
          Header: t('report.beginBalance'),
          disableSortBy: true,
          width: 110,    
          minWidth: 80,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'beginQty',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.beginQty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width: 100,
              minWidth: 80
            },
            {
              Header: t('order.t_amt'),
              accessor: 'beginCost',
         
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.beginCost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width: 100,
              minWidth: 80,
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        }
      ]
    },
   
    
    {
      Header: t('report.income'),
      disableSortBy: true,
      className: 'income-group',
      
      columns: [
        {
          Header: t('report.salesReturn'),
          disableSortBy: true,
          className:'income-column',
          width: 220,          
          minWidth: 200, 
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'pscM_Qty',
              className:'income-column',
              width: 110,          
              minWidth: 100, 
        
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,

              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.pscM_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              
            },
            {
              Header: t('order.t_amt'),
              accessor: 'pscM_Cost',
              className:'income-column',
              width:110,
              minWidth:100,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.pscM_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
            
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('report.income'),
          disableSortBy: true,
          className:'income-column',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'rcQty',
              className:'income-column',
              width:110,
              minWidth:100,
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,

              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.rcQty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              
            },
            {
              Header: t('order.t_amt'),
              accessor: 'rcCost',
              className:'income-column',
              width:110,
              minWidth:100,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.rcCost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
             
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('report.productIncome'),
          disableSortBy: true,
          width : 220,
          minWidth:200,
          className:'income-column',
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'ajrC_Qty',
              className:'income-column',
              width:110,
              minWidth:100,
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,

              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.ajrC_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              
            },
            {
              Header: t('order.t_amt'),
              accessor: 'ajrC_Cost',
              className:'income-column',
              width:110,
              minWidth:100,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.ajrC_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('report.transferIn'),
          disableSortBy: true,
          width : 220,
          minWidth:200,
          className:'income-column',
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'trrC_Qty',
              className:'income-column',
              width:110,
              minWidth:100,
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.trrC_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              
            },
            {
              Header: t('order.t_amt'),
              accessor: 'trrC_Cost',
              className:'income-column',
              width:110,
              minWidth:100,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.trrC_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
       
        {
          Header: t('report.assemblyIn'),
          disableSortBy: true,  
          className:'income-column',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'assemblyRC_Qty',
              className:'income-column',
              width:110,
              minWidth:100,
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.assemblyRC_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
           
            },
            {
              Header: t('order.t_amt'),
              accessor: 'assemblyRC_Cost',
              className:'income-column',
              width:110,
              minWidth:100,
              Footer: 
              info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.assemblyRC_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            },
          ]
        },
        {
          Header: t('count.title'),
          disableSortBy: true,
          className: 'income-column',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'piCountRC_Qty',
              className: 'income-column',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.piCountRC_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width:110,
              minWidth:100,
            },
            {
              Header: t('order.t_amt'),
              accessor: 'piCountRC_Cost',
              className: 'income-column',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.piCountRC_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100, 
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
      ]
    },
    {
      Header: t('report.expense'),
      disableSortBy: true,
      className: 'sales-group noResizer',
      columns: [
        {
          Header: t('report.salesOut'),
          disableSortBy: true,
          className: 'sales-group',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'psiN_Qty',
              className: 'sales-group',
              width:110,
              minWidth:100,
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.psiN_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
            },
            {
              Header: t('order.t_amt'),
              accessor: 'psiN_Cost',
              className: 'sales-group',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.psiN_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100,
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('report.productOut'),
          disableSortBy: true,
          className: 'sales-group',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'ajiI_Qty',
              className: 'sales-group',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.ajiI_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width:110,
              minWidth:100,
            },
            {
              Header: t('order.t_amt'),
              accessor: 'ajiI_Cost',
              className: 'sales-group',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.ajiI_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100,
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('report.transferOut'),
          disableSortBy: true,
          className: 'sales-group',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'triI_Qty',
              className: 'sales-group',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.triI_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width:110,
              minWidth:100,
            },  
            {
              Header: t('order.t_amt'),
              accessor: 'triI_Cost',
              className: 'sales-group',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.triI_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100,
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('report.assemblyOut'),
          disableSortBy: true,
          className: 'sales-group',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'assemblyII_Qty',
              className: 'sales-group',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.assemblyII_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width:110,
              minWidth:100,
            },
            {
              Header: t('order.t_amt'),
              accessor: 'assemblyII_Cost',
              className: 'sales-group',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.assemblyII_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100, 
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        },
        {
          Header: t('count.title'),
          disableSortBy: true,
          className: 'sales-group',
          width : 220,
          minWidth:200,
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'piCountII_Qty',
              className: 'sales-group',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.piCountII_Qty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width:110,
              minWidth:100,
            },
            {
              Header: t('order.t_amt'),
              accessor: 'piCountII_Cost',
              className: 'sales-group',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.piCountII_Cost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100, 
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        }
      ]
    },
    {
      Header: '\u200B', 
      accessor: 'example2',
      canResize: true,
      // className: 'extend-resizer-up',
      className: 'noResizer',
      columns :[
        {
          Header: t('report.endBalance'),
          disableSortBy: true,
          width: 220,          
          minWidth: 200, 
          columns: [
            {
              Header: t('order.t_qty1'),
              accessor: 'endQty',
              Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.endQty || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    {formatNumber(total)}
                  </div>
                );
              },
              width:110,
              minWidth:100, 
            },
            {
              Header: t('order.t_amt'),
              accessor: 'endCost',
              Footer: info => {
                const total = React.useMemo(
                  () => info.rows.reduce((sum, row) => (row.values.endCost || 0) + sum, 0),
                  [info.rows]
                );
                return (
                  <div style={{ textAlign: 'right', paddingRight: 15 }}>
                    <Money value={total} fontSize={14} />
                  </div>
                );
              },
              width:110,
              minWidth:100, 
              Cell: props => (
                <div style={{ textAlign: 'right', paddingRight: 15 }}>
                  <Money value={props?.value} fontSize={14} />
                </div>
              )
            }
          ]
        }
      ]
    },
    
  ]);

  }, [i18n.language, data, setColumns, t]);

  useEffect(() => {
    if (size?.width >= 920)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 110px)');
    else if (size?.width < 920 && size?.width >= 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 200px)');
    else if (size?.width < 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 263px)');
  }, [size?.width]);

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: { pageIndex: 0, pageSize: 2500000 }
    },
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns
  );

  const tableProps = {
    tableInstance,
    hasTotal: true,
    total: data?.length,
    hasFooter: true
  };

  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

  return (
    <div>
      {!data?.length ? (
        <Empty1 {...emptyProps} />
      ) : (
        <div style={{ overflowX: 'scroll' }}>
          <div
            className="table_scroll"
            id="paging"
            style={{ marginTop: 18, overflow: 'auto', maxHeight, minWidth: 520 }}
          >
            <TableRowResize2 {...tableProps} />
          </div>
        </div>
      )}
    </div>
  );
}
            
