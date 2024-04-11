import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { createSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";

import {
  Money,
  PaginationTable,
  Table,
} from "../../../../../src1/components/all/all_m";

export function List(props) {
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState("300px");
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      {
        Header: t("voucher.name"),
        accessor: "name",
        customStyle: { width: 150 },
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("voucher.voucherQty")}</div>
        ),
        accessor: "voucherCount",
        customStyle: { width: 80 },
        exLabel: t("voucher.voucherQty"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            {props.value ? props.value : 0}
          </div>
        ),
      },

      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("voucher.voucherAmt")}</div>
        ),
        accessor: "voucherAmount",
        customStyle: { width: 80 },
        exLabel: t("voucher.voucherAmount"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
      },

      {
        Header: t("voucher.beginDate"),
        accessor: "beginDate",
        customStyle: { width: 80 },
        Cell: ({ value }) => (
          <div style={{}}>
            {value !== null ? moment(value)?.format("yyyy.MM.DD") : ""}
          </div>
        ),
      },
      {
        Header: t("voucher.endDate"),
        accessor: "endDate",
        customStyle: { width: 80 },
        Cell: ({ value }) => (
          <div style={{}}>
            {value !== null ? moment(value)?.format("yyyy.MM.DD") : ""}
          </div>
        ),
      },
      {
        Header: <div style={{ textAlign: "right" }}>{t("voucher.color")}</div>,
        accessor: "color",
        customStyle: { width: 80 },
        exLabel: t("voucher.color"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            {props.value ? props.value : 0}
          </div>
        ),
      },
      {
        Header: t("voucher.status"),
        accessor: "status",
        customStyle: { width: 50 },
        Cell: ({ value, row }) => {
          let status = row?.original?.status;
          let color = status !== 1 ? "var(--text-color)" : "var(--text2-color)";
          return (
            <span style={{ color }}>
              {value === 1 ? "Идэвхтэй" : "Идэвхгүй"}
            </span>
          );
        },
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
    navigate({
      pathname: "voucher_add",
      search: createSearchParams({
        voucherId: row?.original?.voucherId,
      }).toString(),
    });
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: {
        pageIndex: 0,
        pageSize: 25,
        sortBy: [{ id: "transferNo", desc: true }],
      },
    },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const tableProps = { tableInstance, onRowClick };

  return (
    <div>
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
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}
