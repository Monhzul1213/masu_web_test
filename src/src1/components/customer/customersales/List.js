import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';
import { Check, Money, Empty1, FooterTable } from '../../../../components/all';

import { ExportExcel } from '../../../../helpers';
import { SearchInput } from '../../../../components/invt/inventory/list/SearchInput';
import { IconSelect, DynamicAIIcon, DynamicMDIcon, TableRowResize } from '../../../../components/all';
import { Drawer } from '../customersales/Drawer';
import { message } from 'antd';

export function List(props) {
  const {
    data = [], setData, loaded, setShow, checked, setChecked,
    size, onRefund, onSearch, excelName, columns = [], value, setValue,
    className, onSendToTax,
  } = props;

  const defaultColumn = useMemo(() => ({ minWidth: 40, width: 150, maxWidth: 400 }), []);
  const { t, i18n } = useTranslation();
  const [columnsState, setColumnsState] = useState([]);

  const selectedCount = useMemo(
    () => (data || []).filter(r => r?.checked).length,
    [data]
  );
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const handleEnter = (val) => {
    const query = val ? '&InvtName=' + encodeURIComponent(val) : '';
    onSearch && onSearch('', query);
  };
  const onClickSearch = () => setShowSearch(!showSearch);
  const width = showSearch ? 0 : 50;
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 60));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1, className: 'rp_list_search_back_z' };

  const pad = (n) => String(n).padStart(2, '0');
  const toDate = (v) => { if (!v && v !== 0) return null; const d = new Date(v); return isNaN(d.getTime()) ? null : d; };
  const fmtDate = (v) => { const d = toDate(v); if (!d) return ''; return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`; };
  const fmtDateTime = (v) => { const d = toDate(v); if (!d) return ''; return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const pick = (row, keys) => { for (const k of keys) { const v = row?.[k]; if (v !== undefined && v !== null && v !== '') return v; } return undefined; };
  const num = (row, keys) => Number(pick(row, keys)) || 0;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const setDrawerOpenSafe = (v) => setDrawerOpen(!!v);

  const normalizeSelected = (row) => {
    const sale = row?.original ?? row ?? {};
    return {
      sale,
      saleitem: sale?.saleitem ?? sale?.items ?? [],
      paymentitem: sale?.paymentitem ?? sale?.payments ?? [],
      customer: pick(sale, KEYS.customer) || '',
    };
  };

  const handleSendClick = () => {
    if (selectedCount <= 0) {
      message.warning('Дор хаяж 1 борлуулалтын мэдээ сонгоно уу.');
      return;
    }
    onSendToTax?.();
  };

  const openDrawer = (row) => {
    setSelected(normalizeSelected(row));
    setDrawerOpen(true);
  };

const getRowKey = (r) =>
  r?.salesId ?? r?.salesID ?? r?.id ?? r?.Id ?? r?.docId ??
  r?.invoiceNo ?? r?.salesNo ?? r?.docNo ?? null;

  const KEYS = {
    salesType: ['salesType', 'SalesType'],
    customer: ['custName', 'customerName'],
    ttd: ['vatPayerNo', 'vatCustomerId', 'regNo'],
    date: ['salesDate', 'txDate', 'docDate'],
    docNo: ['salesNo', 'invoiceNo', 'docNo'],
    ddtd: ['vatDdtd', 'lotteryNo'],
    amount: ['totalSalesAmount', 'amount', 'grandTotal'],
    vat: ['totalVatAmount', 'vat', 'taxAmount'],
    vatSentAt: ['vatSendDate', 'sentDate'],
    vatSentBy: ['vatSendUser', 'empName'],
    vatFlags: ['useNuatus', 'isVatPayer', 'vatPayer', 'isVAT', 'vatType'],
    custType: ['customerTypeName', 'custTypeName', 'custType', 'customerType'],
  };

  function hasRealDdtd(row) {
  const raw = row?.vatDdtd ?? row?.lotteryNo;
  const v = raw == null ? '' : String(raw).trim();
  return v !== '' && v.toLowerCase() !== 'service called';
}

  function getTypeText(row) {
   const v = pick(row, KEYS.custType);
   const s = v == null ? '' : String(v).trim();
   return s || 'Хувь хүн';
 }

  function eligibleForSelectAll(row) {
  const st = row?.salesType ?? row?.SalesType;
  const isSale  = st === 0 || st === '0';
  const isRefundTx = st === 1 || st === '1';

  const raw = row?.vatDdtd ?? row?.lotteryNo;
  const ddtd = raw == null ? '' : String(raw).trim();

  const isEmpty = ddtd === '';
  const isServiceCalled = ddtd.toLowerCase().includes('service called');

  return (isSale || isRefundTx) && (isEmpty || isServiceCalled);
}

  function getSalesTypeText(row) {
  const st = row?.salesType ?? row?.SalesType;
  if (st === 1 || st === '1') return t('Буцаалт');
  if (st === 0 || st === '0') return t('Борлуулалт');
  return '';
}

  function isVatPayer(row) {
    const flag = pick(row, KEYS.vatFlags);
    if (flag !== undefined) {
      const s = String(flag).toLowerCase();
      return s === 'y' || s === '1' || s === 'true';
    }
    const reg = pick(row, KEYS.ttd);
    return !!(reg && String(reg).trim());
  }

  const excelColumns = useMemo(() => ([
    { exLabel: t('Гүйлгээ'),             accessor: 'salesTypeName' },
    { exLabel: t('Төрөл'),                 accessor: 'typeName' },
    { exLabel: t('Харилцагч'),             accessor: 'customer' },
    { exLabel: t('ТТД'),                   accessor: 'ttd' },
    { exLabel: t('НӨАТ төлөгч'),           accessor: 'vatPayer' },
    { exLabel: t('Огноо'),                 accessor: 'date' },
    { exLabel: t('Баримт'),                accessor: 'docNo' },
    { exLabel: t('ДДТД'),                  accessor: 'ddtd' },
    { exLabel: t('Баримтын дүн'),          accessor: 'amount' },
    { exLabel: t('НӨАТ'),                  accessor: 'vat' },
    { exLabel: t('НӨАТ илгээсэн огноо'),   accessor: 'vatSentAt' },
    { exLabel: t('НӨАТ илгээсэн ажилтан'), accessor: 'vatSentBy' },
  ]), [t]);

  const excelRows = useMemo(() => (
    (data || []).map(r => ({
      salesTypeName: getSalesTypeText(r),
      typeName:  getTypeText(r),
      customer:  pick(r, KEYS.customer) || '',
      ttd:       pick(r, KEYS.ttd) || '',
      vatPayer:  isVatPayer(r) ? 'Y' : 'N',
      date:      fmtDate(pick(r, KEYS.date)),
      docNo:     pick(r, KEYS.docNo) || '',
      ddtd:      pick(r, KEYS.ddtd) || '',
      amount:    num(r, KEYS.amount),
      vat:       num(r, KEYS.vat),
      vatSentAt: fmtDateTime(pick(r, KEYS.vatSentAt)),
      vatSentBy: pick(r, KEYS.vatSentBy) || '',
    }))
  ), [data]);

  useEffect(() => {
    const center = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

    const allColumns = [
      {
        id: 'check',
        noSort: true,
        isBtn: true,
        width: 40,
        minWidth: 40,
        maxWidth: 60,
        Header: <div style={center}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row }) => {
          const locked = hasRealDdtd(row?.original);
          const handleClick = (e) => {
            if (locked) return;
            e?.stopPropagation?.();
            onClickCheck(e, row);
          };
          return (
            <div style={center}>
              <div style={{ opacity: locked ? 0.5 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}>
                <Check checked={row?.original?.checked} onClick={handleClick} />
              </div>
            </div>
          );
        },
      },
      {
        id: 'docNoX',
        Header: t('Баримт'),
        width: 120,
        minWidth: 120,
        maxWidth: 200,
        Cell: ({ row }) => {
          const label = pick(row.original, KEYS.docNo) || t('Дэлгэрэнгүй');
          const handle = (e) => { e.stopPropagation(); openDrawer(row); };
          return (
            <div className="table_link" onClick={handle} style={{ cursor: 'pointer' }}>
              {label}
            </div>
          );
        },
        Footer: (info) => {
          const count = info.rows.length;
          return (
            <div style={{ textAlign: 'center', fontWeight: 600 }}>
              {count}
            </div>
          );
        },
      },
      { id: 'dateX', Header: t('Огноо'), width: 130, minWidth: 120, maxWidth: 180,
        Cell: ({ row }) => <div>{fmtDate(pick(row.original, KEYS.date))}</div> },
      {
        id: 'salesTypeX',
        Header: t('Гүйлгээ'),
        width: 100,
        minWidth: 100,
        maxWidth: 160,
        Cell: ({ row }) => <div>{getSalesTypeText(row.original)}</div>,
      },
      {
        id: 'amountX',
        Header: <div style={{ textAlign: 'right' }}>{t('Баримтын дүн')}</div>,
        width: 120,
        minWidth: 120,
        maxWidth: 200,
        Cell: ({ row }) => (
          <div style={{ textAlign: 'right', paddingRight: 15 }}>
            <Money value={num(row.original, KEYS.amount)} />
          </div>
        ),
        Footer: (info) => {
          const total = useMemo(
            () => info.rows.reduce((s, r) => s + num(r.original, KEYS.amount), 0),
            [info.rows]
          );
          return (
            <div style={{ textAlign: 'right', paddingRight: 15 }}>
              <Money value={total} />
            </div>
          );
        },
      },
      {
        id: 'vatX',
        Header: <div style={{ textAlign: 'right' }}>{t('НӨАТ')}</div>,
        width: 120,
        minWidth: 100,
        maxWidth: 180,
        Cell: ({ row }) => (
          <div style={{ textAlign: 'right', paddingRight: 15 }}>
            <Money value={num(row.original, KEYS.vat)} />
          </div>
        ),
        Footer: (info) => {
          const total = useMemo(
            () => info.rows.reduce((s, r) => s + num(r.original, KEYS.vat), 0),
            [info.rows]
          );
          return (
            <div style={{ textAlign: 'right', paddingRight: 15 }}>
              <Money value={total} />
            </div>
          );
        },
      },
      { id: 'typeNameX', Header: t('Төрөл'), width: 110, minWidth: 100, maxWidth: 160,
        Cell: ({ row }) => <div>{getTypeText(row.original)}</div> },
      { id: 'custNameX', Header: t('Харилцагч'), width: 200, minWidth: 200, maxWidth: 500,
        Cell: ({ row }) => <div>{pick(row.original, KEYS.customer) || ''}</div> },
      { id: 'ttdX', Header: t('ТТД'), width: 120, minWidth: 120, maxWidth: 220,
        Cell: ({ row }) => <div>{pick(row.original, KEYS.ttd) || ''}</div> },
      {
        id: 'ddtdX',
        Header: t('ДДТД'),
        width: 153,
        minWidth: 150,
        maxWidth: 600,
        Cell: ({ row }) => {
          const raw = row?.original?.vatDdtd ?? row?.original?.lotteryNo;
          const txt = raw == null ? '' : String(raw);
          const green = hasRealDdtd(row?.original);
          return <div className={green ? 'ddtd-flag-green' : ''}>{txt}</div>;
        },
      },
      { id: 'vatSentAtX', Header: t('НӨАТ илгээсэн огноо'), width: 160, minWidth: 150, maxWidth: 260,
        Cell: ({ row }) => <div>{fmtDateTime(pick(row.original, KEYS.vatSentAt))}</div> },
      { id: 'vatSentByX', Header: t('НӨАТ илгээсэн ажилтан'), width: 180, minWidth: 160, maxWidth: 300,
        Cell: ({ row }) => <div>{pick(row.original, KEYS.vatSentBy) || ''}</div> },
      {
        id: 'refundX',
        Header: t('Буцаалт'),
        noSort: true,
        width: 140,
        minWidth: 120,
        maxWidth: 200,
        Cell: ({ row }) => {
          const st = pick(row.original, KEYS.salesType);
          const isSale = st === 0 || st === '0';
          if (!isSale) return <span style={{ opacity: 0.5 }}>—</span>;
          const handle = () => { if (typeof onRefund === 'function') onRefund(row.original); };
          return <span className="table_link" onClick={handle} style={{ cursor: 'pointer' }}>{t('Буцаалт хийх')}</span>;
        },
      },
    ];

    const visibleSet = Array.isArray(value) && value.length ? new Set(value) : null;
    const filtered = allColumns.filter(c => c.id === 'check' || !visibleSet || visibleSet.has(c.id));
    setColumnsState(filtered);
  }, [i18n?.language, loaded, checked, value]);

  const onClickCheckAll = () => {
    if (!checked) {
      setChecked(true);
      setData((old) => {
        const next = old.map((row) => ({
          ...row,
          checked: eligibleForSelectAll(row),
        }));
        const any = next.some(r => r.checked);
        setShow(any);
        return next;
      });
    } else {
      setChecked(false);
      setShow(false);
      setData((old) => old.map((row) => ({ ...row, checked: false })));
    }
  };

  const onClickCheck = (e, item) => {
  e?.preventDefault();

  if (hasRealDdtd(item?.original)) return;

  const targetKey = getRowKey(item?.original);
  setChecked(false);
  setData(old => {
    let next;
    if (targetKey != null) {
      next = old.map(r =>
        getRowKey(r) === targetKey ? { ...r, checked: !r?.checked } : r
      );
    } else {
      const idx = old.indexOf(item.original);
      next = old.map((r, i) => (i === idx ? { ...r, checked: !r?.checked } : r));
    }
    setShow(next.some(r => r?.checked));
    return next;
  });
};


  const maxHeight =
    size?.width > 780
      ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 200px)'
      : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 105px - 10px - 350px)';

  const tableInstance = useTable(
    { columns: columnsState, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 250000 } },
    useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns  
  );

  const tableProps = { tableInstance, hasFooter: true };
  const emptyProps = { icon: 'MdSupervisorAccount', type: 'customer', noDescr: true, isMd: true };

  return (
    <div>
      <div className="rp_list_filter_z1">
        <button
          type="button"
          className="btn-green btn-cta with-plus"
          onClick={handleSendClick}
          style={{ marginRight: 8 }}
        >
          Татварт борлуулалт илгээх
        </button>
        <div className="rp_list_filter_z">
        <ExportExcel
          text={t('page.export')}
          columns={excelColumns}
          excelData={excelRows}
          fileName={excelName}
        />
          <div className="rp_list_filter_icon" style={style}>
            <DynamicAIIcon {...searchProps} />
          </div>
          <SearchInput {...inputProps} />
          {value && setValue && Array.isArray(columns) && !!columns.length ? (
            <IconSelect
              value={value}
              setValue={setValue}
              data={columns}
              className={className}
              Icon={() => <DynamicMDIcon name="MdOutlineViewColumn" className="rp_list_drop_icon" />}
              dropdownStyle={{ minWidth: 200 }}
              dropdownAlign={{ offset: [-165, 5] }}
            />
          ) : null}
        </div>
      </div>

      {!Array.isArray(data) || !data.length ? (
        <Empty1 {...emptyProps} />
      ) : (
        <div style={{ overflowX: 'scroll' }}>
          <div
            className="table_scroll"
            id="paging"
            style={{ marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 1100 }}
          >
            <TableRowResize {...tableProps} onRowClick={openDrawer} />
          </div>
        </div>
      )}
      <Drawer selected={selected} open={drawerOpen} setOpen={setDrawerOpenSafe} />
    </div>
  );
}