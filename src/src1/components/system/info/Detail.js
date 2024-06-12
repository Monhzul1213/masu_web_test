import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';

import { PaginationTable, Money, Table, Overlay } from '../../all/all_m';
import { Modal } from 'antd';


export function Detail(props){
  const { data, size, visible, closeModal, loading} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('page.date'), accessor: 'salesDate', customStyle: { minWidth: 20 },
      Cell: ({ value }) => { return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)} },
      { Header: <div style={{textAlign: 'right'}}>{t('discount.amount')}</div>, accessor: 'amt', customStyle: { minWidth: 50 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language,]);

 

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 25 , sortBy: [{ id: 'salesDate', desc: true }]},
  }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel = {closeModal}  centered={true} width={400}>
        <Overlay loading={loading} className='m_back2'>
            <div >
            <div style={{overflowX: 'scroll'}} >
                <div id='paging' style={{marginTop: 0, overflowY: 'scroll', maxHeight, minWidth : 220}}>
                    <Table {...tableProps} />
                </div>
            </div>
            <PaginationTable {...tableProps} />
            </div>
        </Overlay>
    </Modal>
  )
}