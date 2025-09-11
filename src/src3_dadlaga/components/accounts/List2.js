import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useTable,
  usePagination,
  useRowSelect,
  useSortBy,
  useExpanded,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import { TableRowResize } from "../../../components/all";
import { EditableCell } from "./EditableCell.js";

export function List2(props) {
  const { data = [], setData, size, height, onAmountChange } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState("300px");

  const toNum = (v) => (v == null || v === "" ? 0 : Number(String(v).replace(/[,\s]/g, "")) || 0);
  const fmtMoney = (v) =>
    (Number(String(v ?? 0).replace(/[,\s]/g, "")) || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const isDebitRow = (rowObj) => {
    const v =
      rowObj?.original?.glAccount?.IsDebit ??
      rowObj?.original?.glAccount?.isDebit ??
      rowObj?.original?.IsDebit ??
      rowObj?.original?.isDebit ??
      null;
    if (typeof v === "boolean") return v;
    return String(v ?? "").toUpperCase() === "Y";
  };

  useEffect(() => {
    if (height != null) {
      setMaxHeight(typeof height === "number" ? `${height}px` : String(height));
      return;
    }
    if (size?.width >= 830)
      setMaxHeight("calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 130px)");
    else if (size?.width < 830 && size?.width >= 640)
      setMaxHeight("calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 70px)");
    else
      setMaxHeight("calc(100vh - var(--header-height) - var(--page-padding) * 4 - 158px - 10px - 37px)");
  }, [size?.width, height]);

  const updateMyData = useCallback(
    (rowIndex, columnId, value) => {
      setData?.((old) =>
        old.map((row, idx) => {
          if (idx !== rowIndex) return row;
          const next = { ...row };
          if (columnId === "amt") {
            const amt = Math.max(0, toNum(value));
            next.amt = amt;
            const debit = isDebitRow({ original: next });
            next.dtAmt = debit ? amt : 0;
            next.ctAmt = debit ? 0 : amt;
          } else if (columnId === "dtAmt" || columnId === "ctAmt") {
            const n = Math.max(0, toNum(value));
            next[columnId] = n;
            const debit = isDebitRow({ original: next });
            next.amt = debit ? (columnId === "dtAmt" ? n : 0) : (columnId === "ctAmt" ? n : 0);
          } else {
            next[columnId] = value;
          }
          return next;
        })
      );
      onAmountChange?.();
    },
    [setData, onAmountChange]
  );

  const totals = useMemo(() => {
    let dr = 0, cr = 0, amt = 0;
    for (const r of data || []) {
      const d = toNum(r?.dtAmt ?? r?.drAmt ?? 0);
      const c = toNum(r?.ctAmt ?? r?.crAmt ?? 0);
      dr += d;
      cr += c;
      const debit = isDebitRow({ original: r });
      const a = r?.amt != null ? toNum(r.amt) : (debit ? d : c) || Math.max(d, c) || 0;
      amt += a;
    }
    return { dr, cr, amt };
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: t("account.acctCode"),
        accessor: "acct",
        width: 130,
        minWidth: 110,
        maxWidth: 260,
        Footer: () => (
          <span className="data_size_text">{t("info.all") + (data?.length ?? 0)}</span>
        ),
      },
      {
        Header: t("account.title"),
        accessor: "acctName",
        className: "col-title",
        headerClassName: "col-title",
        width: 400,
        minWidth: 120,
        maxWidth: 620,
        Cell: ({ value }) => (
          <div className="truncate" title={value}>
            {value}
          </div>
        ),
        Footer: "",
      },
      {
        Header: t("account.currency"),
        accessor: "currency",
        width: 90,
        minWidth: 70,
        maxWidth: 140,
        Footer: "",
      },
      {
        Header: <div style={{ textAlign: "right" }}>{t("account.amount") || "Дүн"}</div>,
        accessor: "amt",
        width: 200,
        minWidth: 140,
        maxWidth: 260,
        disableSortBy: false,
        isBtn: true,
        exLabel: t("account.amount") || "Дүн",
        Cell: (cellProps) => {
          const row = cellProps.row.original;
          const debit = isDebitRow(cellProps.row);
          const dr = toNum(row?.dtAmt ?? row?.drAmt ?? 0);
          const cr = toNum(row?.ctAmt ?? row?.crAmt ?? 0);
          const current = row?.amt != null ? toNum(row.amt) : (debit ? dr : cr);
          const versionKey = `${row.acct}-${current}`;
          return (
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <EditableCell
                key={versionKey}
                {...cellProps}
                value={fmtMoney(current)}
                updateMyData={updateMyData}
                cellID="hide_border2"
                isMoney
                inputProps={{
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: false,
                  inputMode: "decimal",
                  name: `amt-${row?.acct ?? ""}`,
                }}
              />
            </div>
          );
        },
        Footer: () => (
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            {fmtMoney(totals.amt)}
          </div>
        ),
      },
      {
        Header: <div style={{ textAlign: "right" }}>{t("account.dramt")}</div>,
        accessor: "dtAmt",
        width: 200,
        minWidth: 150,
        maxWidth: 320,
        disableSortBy: false,
        exLabel: t("account.dramt"),
        Cell: ({ row }) => {
          const r = row.original;
          return (
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <span style={{ textAlign: "right" }}>{fmtMoney(toNum(r?.dtAmt))}</span>
            </div>
          );
        },
        Footer: () => (
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            {fmtMoney(totals.dr)}
          </div>
        ),
      },
      {
        Header: <div style={{ textAlign: "right" }}>{t("account.cramt")}</div>,
        accessor: "ctAmt",
        width: 200,
        minWidth: 150,
        maxWidth: 320,
        disableSortBy: false,
        exLabel: t("account.cramt"),
        Cell: ({ row }) => {
          const r = row.original;
          return (
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <span style={{ textAlign: "right" }}>{fmtMoney(toNum(r?.ctAmt))}</span>
            </div>
          );
        },
        Footer: () => (
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            {fmtMoney(totals.cr)}
          </div>
        ),
      },
    ],
    [i18n?.language, updateMyData, totals, t, data?.length]
  );

  const defaultColumn = useMemo(
    () => ({
      minWidth: 60,
      width: 160,
      maxWidth: 400,
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      autoResetSelectedRows: false,
      autoResetRowState: false,
      initialState: { pageIndex: 0, pageSize: 1000000 },
      getRowId: (row, index) => String(row.acct ?? row.id ?? index),
    },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns
  );

  return (
    <form
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      onSubmit={(e) => e.preventDefault()}
      className="ih_header"
    >
      <div style={{ overflowX: "auto" }}>
        <div
          className="table_scroll"
          id="paging"
          style={{
            marginTop: 10,
            overflowY: "auto",
            maxHeight,
            height: maxHeight,
            minWidth: 720,
          }}
        >
          <TableRowResize tableInstance={tableInstance} hasFooter />
        </div>
      </div>
    </form>
  );
}
