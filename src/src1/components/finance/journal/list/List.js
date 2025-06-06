import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useBlockLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { createSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";

import { Money, TableResize } from "../../../../../components/all";

export function List(props) {
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState("300px");
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      {
        Header: '#',
        accessor: "journalId",
        width: 80,
        minWidth: 50
      },
      {
        Header: t("page.date"),
        accessor: "txnDate",
        width: 140,
        minWidth: 100,
        Cell: ({ value }) => moment(value).format("yyyy.MM.DD")
      },
      {
        Header: <div style={{textAlign: 'right', paddingRight: 15}}>{t("invoice.amount")}</div>,
        accessor: "totalAmt",
        width: 130, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>
      },
      {
        Header: t("shop.descr"),
        accessor: "descr",
        width: 150,
        minWidth: 90,
      },
      {
        Header: t("manage.t_no"),
        accessor: "sourceTypeName",
        width: 150,
        minWidth: 80,
      },
      {
        Header: t("customer.title"),
        accessor: "custName",
        width: 180,
        minWidth: 130,
      },
      {
        Header: t("order.status"),
        accessor: "statusName",
        width: 150,
        minWidth: 100,
      },
      {
        Header: t("adjust.t_created"),
        accessor: "createdDate",
        width: 140,
        minWidth: 100,
        Cell: ({ value }) => (
          <div style={{}}>{moment(value).format("yyyy.MM.DD HH:mm")}</div>
        ),
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if (size?.width >= 830)
      setMaxHeight(
        "calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)"
      );
    else if (size?.width < 830 && size?.width >= 640)
      setMaxHeight(
        "calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 10px - 37px)"
      );
    else
      setMaxHeight(
        "calc(100vh - var(--header-height) - var(--page-padding) * 4 - 158px - 10px - 37px)"
      );
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onRowClick = (row) => {
    navigate({ pathname: "journal_add",
      search: createSearchParams({ journalId: row?.original?.journalId}).toString(),
    });
  };

  const defaultColumn = useMemo(
    () => ({ minWidth: 30, width: 150, maxWidth: 400 }),
    []
  );
  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: {
        pageIndex: 0,
        pageSize: 1000,
        sortBy: [{ id: "templateId", desc: false }],
      },
    },
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns
  );
  const tableProps = { tableInstance, onRowClick };

  return (
    <>
      <div className="ih_header">
        <div
          className="table_scroll"
          id="paging"
          style={{
            marginTop: 10,
            overflow: "scroll",
            maxHeight,
            minWidth: 720,
          }}
        >
          <TableResize {...tableProps} />
        </div>
        <p className='data_size_text'>{t('info.all') + data?.length}</p>
      </div>
    </>
  );
}
