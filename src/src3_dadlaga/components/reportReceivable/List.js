import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable, useRowSelect } from 'react-table';

import { Money, FooterTable } from '../../../components/all';
import { Header } from '../../../src1/components/report/employee';
import { Transaction } from '../../../src1/components/customer/customer/Transaction';

export function List(props) {
    const { data, excelName } = props;
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => { 
        setColumns([
            { Header: <div >{t('customer.title')}</div>, accessor: 'custName', exLabel: t('customer.title'),
                Cell: ({ value, row, onClickLink }) => {
                    return  (<div className='table_link' onClick={() => onClickLink(row)}>{value}</div>);
                }, Footer:  <div style={{textAlign: 'left', paddingRight: 15}}>{t('report.total') + data?.length }</div>
            },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_beg')} </div>, accessor: 'beginArAmount', exLabel: 'Эхний үлдэгдэл', 
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/> </div>,
            Footer: info => {
                const total = React.useMemo(() =>
                  info.rows.reduce((sum, row) => row.values.beginArAmount + sum, 0),
                  [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
              } },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_crea')} </div>, accessor: 'addAmount',exLabel: 'Авлага үүсгэсэн дүн',
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>,
            Footer: info => {
                const total = React.useMemo(() =>
                  info.rows.reduce((sum, row) => row.values.addAmount + sum, 0),
                  [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
            }  },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_clos')} </div>, accessor: 'closeAmount',exLabel: 'Авлага хаасан дүн',
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>,
            Footer: info => {
                const total = React.useMemo(() =>
                  info.rows.reduce((sum, row) => row.values.closeAmount + sum, 0),
                  [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
            }  },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_final')} </div>, accessor: 'endArAmount',exLabel: 'Эцсийн үлдэгдэл',
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>,
            Footer: info => {
                const total = React.useMemo(() =>
                  info.rows.reduce((sum, row) => row.values.endArAmount + sum, 0),
                  [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
            }}
          ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n?.language, data]); 

    const onClickLink = row => {
        setVisible(true);
        setSelected(row?.original);
    };

    const closeModal = () => {
        setVisible(false);
    };

    const tableInstance = useTable({
        columns,
        data,
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'salesTime', desc: true }] },
        onClickLink
    }, useSortBy, usePagination, useRowSelect );

    const tableProps = { tableInstance, hasFooter: true };
    const exportExcelProps = {data, columns, excelName };
    let subProps = { visible, closeModal , selected};

    return (
        <div className="rp_list" style={{maxWidth: 1000}}>
            {visible && <Transaction {...subProps} />}
            <Header {...exportExcelProps}/>
            <div className="table_scroll" style={{ overflow: 'scroll' }}>
                <div id="paging" style={{ marginTop: 10, minWidth: 720, maxHeight: 500 }}>
                    <FooterTable {...tableProps} />
                </div>
            </div>
        </div>
    );    
}
