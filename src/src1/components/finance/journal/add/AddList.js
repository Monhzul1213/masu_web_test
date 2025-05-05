import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withSize } from "react-sizeme";
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from "react-table";
import { useTranslation } from "react-i18next";

import { DynamicBSIcon, TableResize } from "../../../../../components/all";
import { ItemSelect } from "./SelectItem";
import { EditableCell as EditableCellQty } from './EditableCell';

function Card(props) {
  const { size, detail, setSearch, setDItems, search, setDetail, setEdited} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    let columns = [
      { Header: t("journal.acctCode"), accessor: "acct", width: 180, minWidth: 150 },
      { Header: t("transModel.acctName"), accessor: "acctName", isText: true, width: 200, minWidth: 180},
      { Header: t("journal.debit"), accessor: "drAmt", isBtn: true, width: 150, minWidth: 100,
        Cell: props => <EditableCellQty {...props} />, isMoney: true},
      { Header: t("journal.credit"), accessor: "crAmt", isBtn: true, width: 150, minWidth: 100,
        Cell: props => <EditableCellQty {...props} />, isMoney: true},
      { Header: t("shop.descr"), accessor: "itemDescr", isBtn: true, width: 150, minWidth: 100,
        Cell: props => <EditableCellQty {...props} /> },
    ];
    // if(editable)
      columns.push({
        id: 'delete', noSort: true, Header: '', width: 40, minWidth: 40, maxWidth: 40,
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      });
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(
      (row) =>
        // row.values["name"]?.toLowerCase()?.includes(query?.toLowerCase()) ||
        row.values["acctCode"]?.includes(query)
    );
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    // let total = 0;
    setDetail(old => old.map((row, index) => {
      if(index === rowIndex){
        let drAmt = columnId === 'drAmt' ? parseFloat(value ? value : 0) : old[rowIndex]?.drAmt;
        let crAmt = columnId === 'crAmt' ? parseFloat(value ? value : 0) : old[rowIndex]?.crAmt;
        let itemDescr = columnId === 'itemDescr' ? value ? value : '' : old[rowIndex]?.itemDescr;
        // let total1 = total + drAmt
        // setPrice({value: total1})
        return { ...old[rowIndex], drAmt, crAmt, itemDescr };
      } else { 
        // total += row?.drAmt ?? 0
        return row;
      }
    }));
    setEdited && setEdited(true); 
    setSearch({ value: null });
  }
  
  const onClickDelete = row => {
    if(row?.original?.accountID !== 0) setDItems(old => [...old, row?.original]);
    setDetail(detail?.filter(item => item?.accountID !== row?.original?.accountID));
    setSearch({ value: null });
  }

  const newItem = acct => {
    return { accountID: acct?.acct, acct: acct?.acct, drAmt: acct?.drAmt ?? 0, crAmt: acct?.crAmt ?? 0, acctName: acct?.acctName, 
      isDebit: acct?.isDebit, status: acct?.status, currency: acct?.currency, itemDescr: acct?.itemDescr ?? '', rowStatus: 'I'};
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }),[]);
  const tableInstance = useTable(
    {
      columns,
      data: detail,
      defaultColumn,
      autoResetPage: false,
      autoResetGlobalFilter: false,
      autoResetSortBy: false,
      initialState: { pageIndex: 0, pageSize: 25 },
      globalFilter: filterFunction, updateMyData, onClickDelete},
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns
  );
  const tableProps = { tableInstance };
  const maxHeight =  "calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))";
  const id = size?.width > 780 ? "ih_large" : "ih_small";
  const selectProps = {setSearch, search, data: detail, setData: setDetail, newItem}
  return (
    <div className="po_back_invt3">
      <div className="po_search_back" id={id}>
        <p className="ac_title">{t("transModel.acct")}</p>
      </div>
      <div
        id="paging"
        // className="table_scroll"
        style={{ overflowY: "scroll", maxHeight }}
      >
        <TableResize {...tableProps} />
        <ItemSelect {...selectProps}/>
        {/* {editable ? <DetailAdd addDetail={addDetail} /> : ""} */}
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const AddList = withSizeHOC(Card);
