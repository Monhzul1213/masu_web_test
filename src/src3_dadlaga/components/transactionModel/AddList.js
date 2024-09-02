import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withSize } from "react-sizeme";
import {
  useBlockLayout,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { useTranslation } from "react-i18next";
import {
  Check,
  DynamicBSIcon,
  PaginationTable,
  TableResize,
} from "../../../components/all";
import { DetailAdd } from "./DetailAdd";

function Card(props) {
  const {
    size,
    detail,
    setSearch,
    setEdited,
    editable,
    addDetail,
    onClickDelete,
  } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    let columns = [
      {
        Header: t("transModel.acct"),
        accessor: "acct",
        customStyle: { minWidth: 150 },
        width: 170,
        minWidth: 150,
      },
      {
        Header: t("transModel.acctName"),
        accessor: "acctName",
        isText: true,
        width: 200,
        minWidth: 180,
      },
      {
        Header: t("transModel.debit"),
        accessor: "isDebit",
        isBtn: true,
        width: 80,
        minWidth: 60,
        Cell: ({ value }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Check
              onClick={() => {}}
              checked={value === "1"}
              disabled={!editable}
            />
          </div>
        ),
      },
      {
        Header: t("transModel.formula"),
        accessor: "formula",
        isBtn: true,
        width: 250,
        minWidth: 190,
      },
    ];
    if (editable)
      columns.push({
        id: "delete",
        noSort: true,
        Header: "",
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        Cell: ({ row }) => (
          <div className="ac_delete_back">
            <DynamicBSIcon
              name="BsTrashFill"
              className="ac_delete"
              onClick={() => onClickDelete(row)}
            />
          </div>
        ),
      });
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, editable]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(
      (row) =>
        row.values["name"]?.toLowerCase()?.includes(query?.toLowerCase()) ||
        row.values["barCode"]?.includes(query)
    );
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();

    setEdited && setEdited(true);
    setSearch({ value: null });
  };

  const defaultColumn = useMemo(
    () => ({ minWidth: 30, width: 150, maxWidth: 400 }),
    []
  );
  const tableInstance = useTable(
    {
      columns,
      data: detail,
      defaultColumn,
      autoResetPage: false,
      autoResetGlobalFilter: false,
      autoResetSortBy: false,
      initialState: { pageIndex: 0, pageSize: 25 },
      globalFilter: filterFunction,
      updateMyData,
      onClickDelete,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns
  );
  const tableProps = { tableInstance };
  const maxHeight =
    "calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))";
  const classPage =
    size?.width > 510 ? "ii_page_row_large" : "ii_page_row_small";
  const id = size?.width > 780 ? "ih_large" : "ih_small";

  return (
    <div className="po_back_invt3">
      <div className="po_search_back" id={id}>
        <p className="ac_title">{t("transModel.acct")}</p>
      </div>
      <div
        id="paging"
        className="table_scroll"
        style={{ overflowY: "scroll", maxHeight }}
      >
        <TableResize {...tableProps} />
        {editable ? <DetailAdd addDetail={addDetail} /> : ""}
      </div>
      <div className={classPage}>
        <PaginationTable {...tableProps} />
        <div />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const AddList = withSizeHOC(Card);
