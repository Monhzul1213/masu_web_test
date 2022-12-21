import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Table, PaginationTable, IconButton, DynamicMDIcon } from '../../../all';
import { Location } from './Location';

export function List(props){
  const { data, setData, setEdited } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let columns = [
      { Header: t('inventory.t_site'), accessor: 'name' },
      { Header: t('tax.location'), accessor: 'descr' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('shop.t_pqty')}</div>, accessor: 'posQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>
      },
      {
        Header: t('tax.coordinate'), accessor: 'coordinate',
        Cell: ({ value, onPressCoordinate, row }) => (
          <div className='co_coord'>
            <IconButton className='co_coord_btn' icon={<DynamicMDIcon name='MdLocationPin' className='co_coord_icon' />} onClick={() => onPressCoordinate(row)} />
            <p className='co_coord_text'>{value}</p>
          </div>
        )
      }
    ];
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onPressCoordinate = row => {
    setSelected({ item: row?.original, index: row?.index });
    setVisible(true);
  }

  const closeModal = (hasLocation, y, x) => {
    setVisible(false);
    if(hasLocation){
      setData(old => old.map((row, index) => {
        let coordinate = y + '\n' + x;
        if(index === selected?.index) return { ...old[selected?.index], locationX: x, locationY: y, hasLocation: true, coordinate };
        else return row;
      }));
      setEdited && setEdited(true);
    }
    setSelected(null);
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onPressCoordinate }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const mapProps = { visible, selected, closeModal };
  
  return (
    <div className='add_back' style={{paddingTop: 0}}>
      <Location {...mapProps} />
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}