import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Check, Table } from '../../../all';

export function ModalSite(props){
  const { data, setData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let style = { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 72 };
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle: { width: 15 },
        Header: <div style={style}></div>,
        Cell: ({ row, onClickCheck }) =>
          <div style={style}>
            <Check checked={row?.original?.checkedS} disabled={row?.original?.checkedSOrg} onClick={e => onClickCheck(e, row)} />
          </div>,
      },
      { Header: <div style={{flex: 1}}>{t('inventory.t_site')}</div>, accessor: 'name', isText: true }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);


  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checkedS: !row?.checkedS };
      return row
    }));
  }

 
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 10000 }, onClickCheck },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, noHeader: true };

  return (
    <div style={{ marginTop: 15 }}>
      <p className='select_lbl'>{t('inventory.sites')}</p>
      <div id='paging' style={{overflowY: 'scroll', maxHeight: 200}}>
        <Table {...tableProps} />
      </div>
    </div>
  );
}