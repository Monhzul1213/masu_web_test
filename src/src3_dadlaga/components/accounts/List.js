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

import { TableResize } from "../../../components/all";

export function List(props) {
  const { data, size, setOpenModal } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState("300px");
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      {
        Header: t("account.acctCode"),
        accessor: "acct",
        width: 150,
        minWidth: 100,
      },
      {
        Header: t("account.title"),
        accessor: "acctName",
        width: 300,
        minWidth: 100,
      },
      {
        Header: t("account.acctType"),
        accessor: "accTypeName",
        width: 120,
        minWidth: 50,
      },
      {
        Header: t("account.acctClass"),
        accessor: "acctClassName",
        width: 200,
        minWidth: 120,
      },
      {
        Header: t("account.currency"),
        accessor: "currency",
        width: 100,
        minWidth: 50,
      },
      // {
      //   Header: t("account.isDebit"),
      //   accessor: "isDebit",
      //   width: 150,
      //   minWidth: 80,
      //   Cell: ({ value }) => (
      //     <div style={{ marginTop: -17 }}>
      //       <CheckBox disabled={true} checked={value === "Y"} />
      //     </div>
      //   ),
      // },
      {
        Header: t("account.status"),
        accessor: "status",
        width: 120,
        minWidth: 80,
        Cell: ({ value }) => <div>{value === 1 ? "Идэвхтэй" : "Хүчингүй"}</div>,
      },
      {
        Header: t("shop.title"),
        accessor: "siteName",
        width: 150,
        minWidth: 80,
      },
      {
        Header: t("account.lastUpdate"),
        accessor: "lastUpdate",
        width: 180,
        minWidth: 80,
        Cell: ({ value }) => (
          <div style={{}}>{moment(value).format("yyyy.MM.DD HH:mm")}</div>
        ),
      },
      {
        Header: t("account.lastUserId"),
        accessor: "lastUserName",
        width: 150,
        minWidth: 80,
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
    const classId = row?.original.acctClassId;
    setOpenModal(true);
    navigate({
      search: createSearchParams({
        classId: classId,
        acct: row?.original?.acct,
      }).toString(),
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
        <div style={{ overflowX: "scroll" }}>
          <div
            className="table_scroll"
            id="paging"
            style={{
              marginTop: 10,
              overflowY: "scroll",
              maxHeight,
              minWidth: 720,
            }}
          >
            <TableResize {...tableProps} />
          </div>
        </div>
        <p className='data_size_text'>{t('info.all') + data?.length}</p>
        {/* <PaginationTable {...tableProps} /> */}
      </div>
    </>
  );
}
