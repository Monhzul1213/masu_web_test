import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTable, usePagination, useRowSelect, useSortBy } from "react-table";
import { withSize } from "react-sizeme";

import { Money, FooterTable } from "../../../components/all";
import { ItemSelect, SelectItem } from "./SelectItem";
import { EditableCell1 } from "../../../src1/components/report/order/EditableCell";
import { divide } from "../../../helpers";

export function List(props) {
  const { data, setData, search, setSearch, setDKits, number } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t("orderCreate.invtId"),
        customStyle: { width: 180 },
        accessor: "invtId",
        Cell: ({ row }) => <SelectItem item={row?.original} />,
        Footer: (info) => {
          return (
            <>
              <div style={{ textAlign: "left", paddingRight: 15 }}>Нийт</div>
            </>
          );
        },
      },

      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("orderCreate.qty")}</div>
        ),
        accessor: "qty",
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <EditableCell1 {...props} />
          </div>
        ),
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("orderCreate.price")}</div>
        ),
        accessor: "price",
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("orderCreate.amount")}</div>
        ),
        accessor: "amount",
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
        Footer: (info) => {
          const total = React.useMemo(
            () => info.rows.reduce((sum, row) => row.values.amount + sum, 0),
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
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickDelete = (row) => {
    if (row?.original?.consumerId || row?.original?.consumerId === 0)
      setDKits((old) => [...old, row?.original]);
    setData(
      data?.filter((item) => item?.consumerId !== row?.original?.consumerId)
    );
    setSearch({ value: null });
  };

  const newItem = (invt) => {
    return {
      invtId: invt?.invtId,
      name: invt?.name,
      qty: 0,
      price: invt?.price,
      amount: 0,
    };
  };
  const updateMyData = (rowIndex, columnId, value, e) => {
    e.preventDefault();
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          let qty =
            columnId === "qty"
              ? parseFloat(value ? value : 0)
              : old[rowIndex]?.qty;

          let amount = divide(qty, old[rowIndex]?.price, true);

          return { ...old[rowIndex], qty, amount, lineNbr: index };
        } else {
          return row;
        }
      })
    );

    setSearch({ value: null });
  };

  const maxHeight =
    "calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))";
  const tableInstance = useTable(
    {
      columns,
      data,
      setData,
      autoResetPage: false,
      initialState: { pageIndex: 0, pageSize: 25 },
      onClickDelete,
      updateData: updateMyData,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const tableProps = { tableInstance, hasFooter: true };
  const selectProps = {
    search,
    setSearch,
    data,
    setData,
    newItem,
    number,
  };

  return (
    <div>
      <div
        className="table_scroll"
        id="paging"
        style={{ overflowY: "scroll", maxHeight, overflowX: "scroll" }}
      >
        <FooterTable {...tableProps} />
      </div>
      <ItemSelect {...selectProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const CardService = withSizeHOC(List);
