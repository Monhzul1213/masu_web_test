import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withSize } from "react-sizeme";
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from "react-table";
import { useTranslation } from "react-i18next";

import { DynamicBSIcon, Money, TableRowResize } from "../../../../../components/all";
import { ItemSelect } from "./SelectItem";
import { EditableCell as EditableCellQty, SelectableCell } from './EditableCell';

function Card(props) {
  const { size, detail, setSearch, setDItems, search, setDetail, setEdited, vatPropertys, cashPropertys, setPrice} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let columns = [
      { Header: t("journal.acctCode"), accessor: "acct", width: 140, minWidth: 80, Footer: <div style={{textAlign: 'left',}}>{t('report_receipt.amt')}</div>},
      { Header: t("transModel.acctName"), accessor: "acctName", isText: true, width: 180, minWidth: 120},
      { Header: t("journal.debit"), accessor: "drAmt", isBtn: true, width: 110, minWidth: 110,
        Cell: props => <EditableCellQty {...props} />, isMoney: true,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.drAmt + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} /></div></>
          }
      },
      { Header: t("journal.credit"), accessor: "crAmt", isBtn: true, width: 110, minWidth: 110,
        Cell: props => <EditableCellQty {...props} />, isMoney: true,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.crAmt + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} /></div></>
          }
      },
      { Header: t('transModel.vatSelect'), accessor: 'vatPropertyID', isBtn: true, width: 300, minWidth: 280,
        Cell: props =><div style={{paddingRight: 10}}><SelectableCell {...props} data={sortedVat} s_value = "constKey" s_descr = "valueStr1"/></div>},
      { Header: t('transModel.cashSelect'), accessor: 'cashPropertyID', isBtn: true, width: 300, minWidth: 280,
        Cell: props => <div style={{paddingRight: 10}}><SelectableCell {...props} data={sortedCash} s_value = "constKey" s_descr = "valueStr1"/></div>},
      { Header: t("shop.descr"), accessor: "itemDescr", isBtn: true, width: 150, minWidth: 150,
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


  const sortedVat = useMemo(() => {
    const arr = Array.isArray(vatPropertys) ? [...vatPropertys] : [];
    return arr.sort((a, b) =>
      String(a?.valueStr1 ?? "").localeCompare(String(b?.valueStr1 ?? ""), "mn", {
        numeric: true,
        sensitivity: "base",
      })
    );
  }, [vatPropertys]);
 
  const sortedCash = useMemo(() => {
    const arr = Array.isArray(cashPropertys) ? [...cashPropertys] : [];
    return arr.sort((a, b) =>
      String(a?.valueStr1 ?? "").localeCompare(String(b?.valueStr1 ?? ""), "mn", {
        numeric: true,
        sensitivity: "base",
      })
    );
  }, [cashPropertys]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(
      (row) =>
        // row.values["name"]?.toLowerCase()?.includes(query?.toLowerCase()) ||
        row.values["acctCode"]?.includes(query)
    );
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setDetail(old => {
      const newData = old.map((row, index) => {
        if (index === rowIndex) {
          let drAmt = columnId === 'drAmt' ? parseFloat(value || 0) : row.drAmt;
          let crAmt = columnId === 'crAmt' ? parseFloat(value || 0) : row.crAmt;
          let itemDescr = columnId === 'itemDescr' ? value || '' : row.itemDescr;
          let vatPropertyID = columnId === 'vatPropertyID' ? value || '' : row.vatPropertyID;
          let cashPropertyID = columnId === 'cashPropertyID' ? value || '' : row.cashPropertyID;
          return { ...row, drAmt, crAmt, itemDescr, vatPropertyID, cashPropertyID };
        }
        return row;
      });
      const total = newData.reduce((sum, r) => sum + (parseFloat(r.drAmt) || 0), 0);
      const total1 = newData.reduce((sum, r) => sum + (parseFloat(r.crAmt) || 0), 0);

      setPrice({ value: total ?? total1 });
      return newData;
    });
  
    setEdited && setEdited(true); 
    setSearch({ value: null });
  };
  
  
  const onClickDelete = row => {
    if(row?.original?.acct !== 0) setDItems(old => [...old, row?.original]);
    setDetail(prev => prev.filter(item => item?.acct !== row?.original?.acct));
    setSearch({ value: null });
  }

  const newItem = acct => {
    return { accountID: acct?.acct, acct: acct?.acct, drAmt: acct?.drAmt ?? 0, crAmt: acct?.crAmt ?? 0, acctName: acct?.acctName, 
      isDebit: acct?.isDebit, status: acct?.status, currency: acct?.currency, itemDescr: acct?.itemDescr ?? '', rowStatus: 'I'};
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 900 }),[]);
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
  const tableProps = { tableInstance, hasFooter: true };
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
        className="table_scroll"
        style={{ overflowY: "scroll", maxHeight }}
      >
        <TableRowResize {...tableProps} />
        <ItemSelect {...selectProps}/>
        {/* {editable ? <DetailAdd addDetail={addDetail} /> : ""} */}
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const AddList = withSizeHOC(Card);
