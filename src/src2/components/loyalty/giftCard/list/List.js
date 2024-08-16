import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { createSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";

import { FooterTable, Money } from "../../../../../src1/components/all/all_m";

export function List(props) {
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState("300px");
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      {
        Header: t("giftCard.cardNumber"),
        accessor: "cardNumber",
        customStyle: { width: 120 },
        Footer: 'Нийт: ' + data?.length
      },
      {
        Header: t("giftCard.descr"),
        accessor: "descr",
        customStyle: { width: 120 },
      },
      {
        Header: t("giftCard.beginDate"),
        accessor: "beginDate",
        customStyle: { width: 80 },
        Cell: ({ value }) => (
          <div style={{}}>
            {value !== null ? moment(value)?.format("yyyy.MM.DD") : ""}
          </div>
        ),
      },
      {
        Header: t("giftCard.endDate"),
        accessor: "endDate",
        customStyle: { width: 90 },
        Cell: ({ value }) => (
          <div style={{}}>
            {value !== null ? moment(value)?.format("yyyy.MM.DD") : ""}
          </div>
        ),
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("giftCard.cardAmount")}</div>
        ),
        accessor: "cardAmount",
        customStyle: { width: 90 },
        exLabel: t("giftCard.cardAmount"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
        Footer: (info) => {
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.cardAmount + sum, 0),
            [info.rows]
          );
          return (
            <>
              <div style={{ textAlign: "right", paddingRight: 15 }}>
                <Money value={total} fontSize={14} />
              </div>
            </>
          );
        },
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("giftCard.salesAmount")}</div>
        ),
        accessor: "salesAmount",
        customStyle: { width: 105 },
        exLabel: t("giftCard.salesAmount"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
        Footer: (info) => {
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.salesAmount + sum, 0),
            [info.rows]
          );
          return (
            <>
              <div style={{ textAlign: "right", paddingRight: 15 }}>
                <Money value={total} fontSize={14} />
              </div>
            </>
          );
        },
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>
            {t("giftCard.balanceAmount")}
          </div>
        ),
        accessor: "balanceAmount",
        customStyle: { width: 80 },
        exLabel: t("giftCard.balanceAmount"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
        Footer: (info) => {
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.balanceAmount + sum, 0),
            [info.rows]
          );
          return (
            <>
              <div style={{ textAlign: "right", paddingRight: 15 }}>
                <Money value={total} fontSize={14} />
              </div>
            </>
          );
        },
      },

      {
        Header: t("giftCard.createdDate"),
        accessor: "createdDate",
        customStyle: { width: 120 },
        Cell: ({ value }) => (
          <div style={{}}>{moment(value)?.format("yyyy.MM.DD hh:mm:ss")} </div>
        ),
      },
      {
        Header: t("giftCard.createdUserID"),
        accessor: "createdUserName",
        customStyle: { width: 85 },
      },

      {
        Header: t("giftCard.status"),
        accessor: "status",
        customStyle: { width: 10 },
        Cell: ({ value, row }) => {
          let status = row?.original?.status;
          let color = status !== 1 ? "var(--text-color)" : "var(--text2-color)";
          return (
            <span style={{ color }}>
              {value === 1 ? "Идэвхтэй" : "Хүчингүй"}
            </span>
          );
        },
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

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
      pathname: "giftCard_add",
      search: createSearchParams({
        giftCardId: row?.original?.giftCardId,
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
        pageSize: 10000,
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
          <FooterTable {...tableProps} />
        </div>
      </div>
    </div>
  );
}
