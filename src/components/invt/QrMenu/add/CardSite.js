import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Check, CheckAll, Table } from '../../../all';

export function CardSite(props) {
  const { data, setData, setEdited, checked, setChecked, id, label } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 72,
    };

    setColumns([
      {
        id: 'check',
        noSort: true,
        isBtn: true,
        customStyle: { width: 75 },
        Header: <div style={style}>{t('inventory.t_choose')}</div>,
        Cell: ({ row }) => (
          <div style={style}>
            <Check
              checked={row?.original?.checked}
              onClick={(e) => onClickCheck(e, row)}
            />
          </div>
        ),
      },
      {
        Header: <div>{t('inventory.t_site')}</div>,
        accessor: 'name',
        isText: true,
      }
    ]);
  }, [i18n.language]);


  const onCheckAll = (isChecked) => {
    setChecked(isChecked);
    setEdited?.(true);
    setData((old) =>
      old.map((row) => ({
        ...row,
        checked: isChecked,
      }))
    );
  };

  const onClickCheck = (e, row) => {
    e?.preventDefault();
    setChecked(false);
    setEdited?.(true);

    const clickedSiteId = row?.original?.siteId;

    setData((old) =>
      old.map((r) =>
        r.siteId === clickedSiteId ? { ...r, checked: !r.checked } : r
      )
    );
  };

  const checkProps = {
    type: label ?? 'inventory',
    checked,
    onCheckAll,
    style: { border: 'none' },
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      initialState: { pageIndex: 0, pageSize: 250000 },
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const tableProps = { tableInstance };
  const maxHeight =
    'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';

  return (
    <div className={id ?? 'ma_back'} style={{ maxWidth: "700px", marginTop: 20 }}>
      <p className="ac_title">{t('inventory.sites')}</p>
      <div style={{ padding: 5 }} />
      <CheckAll {...checkProps} />
      <div id="paging" style={{ overflowY: 'scroll', maxHeight }}>
        <Table {...tableProps} />
      </div>
    </div>
  );
}