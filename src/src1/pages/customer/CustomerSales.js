import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SizeMe } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Overlay, Error1, Confirm } from '../../components/all/all_m';
import { Add } from '../../components/customer/customer';
import { List } from '../../components/customer/customersales/List';
import { Card } from '../../components/customer/customersales/Card';
import Header from '../../components/customer/customersales/Header';
import { getList, getServiceBar, sendRequest } from '../../../services';
import '../../css/customer.css';
import { Subscription } from '../../../components/management/adjust/list/Subscription';
import { Help } from '../../../components/invt/inventory/list';
import { Empty2 } from '../../../components/all';
import moment from 'moment';

export function CustomerSales(props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [data, setData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const [loaded, setLoaded] = useState(0);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [branch, setBranch] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [filter, setFilter] = useState('');
  const [checked, setChecked] = useState(false);
  const allTotals = useMemo(() => calcTotals(data || []), [data]);

const columnOptions = [
  { label: t('Гүйлгээ'),               value: 'salesTypeX' },
  { label: t('Төрөл'),                 value: 'typeNameX' },
  { label: t('Харилцагч'),             value: 'custNameX' },
  { label: t('ТТД'),                   value: 'ttdX' },
  { label: t('НӨАТ төлөгч'),           value: 'vatPayerX' },
  { label: t('Огноо'),                 value: 'dateX' }, 
  { label: t('Баримт'),                value: 'docNoX' },
  { label: t('ДДТД'),                  value: 'ddtdX' },
  { label: t('Баримтын дүн'),          value: 'amountX' },
  { label: t('НӨАТ'),                  value: 'vatX' },
  { label: t('НӨАТ илгээсэн огноо'),   value: 'vatSentAtX' },
  { label: t('НӨАТ илгээсэн ажилтан'), value: 'vatSentByX' },
  { label: t('Буцаалт'),               value: 'refundX' },
];

const [colMenuValue, setColMenuValue] = useState(columnOptions.map(o => o.value));

  const { user, token } = useSelector((state) => state.login);
  const maxWidth = useSelector((state) => state.temp.maxWidth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [invt, setInvt] = useState([]);

  const API_BASE = 'Sales/GetSalesList';

  const getBranchs = useCallback(async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getServiceBar('getBranchInfo'));
    if (response?.error) setError(response?.error);
    else {
      let data = [];
      response?.data?.data?.forEach((item) => {
        let index = data?.findIndex((list) => item.branchCode === list.branchCode);
        if (index === -1) data.push(item);
      });
      setBranch(data?.sort((a, b) => a?.branchCode - b?.branchCode));
      setAllBranch(response?.data?.data);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => { getBranchs(); }, [getBranchs]);

  const getData = useCallback(async (query) => {
    setFilter(query);
    setError(null);
    setLoading(true);

    const f = 'YYYY.MM.DD';
    const fallback = `?BeginDate=${moment().startOf('month').format(f)}&EndDate=${moment().format(f)}`;
    const api = API_BASE + (query || fallback);
    const response = await dispatch(getList(user, token, api));

    if (response?.code === 1000) {
      setVisible1(true);
    }

    if (response?.error) setError(response?.error);
    else {
      const payload = response?.data ?? response;
      const rd = payload?.retdata ?? payload?.retData ?? payload?.data ?? payload;
      let rows =
        (Array.isArray(rd) && rd) ||
        rd?.saleslist || rd?.salesList || rd?.SalesList ||
        payload?.saleslist || payload?.salesList || payload?.SalesList || [];
      if (!Array.isArray(rows)) rows = [];

      setData(rows);
      setExcelName(t('header./customer_sales') || 'customer_sales');
    }

    setLoaded((prev) => prev + 1);
    setLoading(false);
    setShow(false);
    setChecked(false);
    setFiltering(!!query);
  }, [dispatch, user, token, t]);

  useEffect(() => {
    if (branch.length > 0 && user?.msRole?.webManageItem === 'Y' && filter) {
      getData(filter);
    }
  }, [branch, filter, user?.msRole?.webManageItem, getData]);


  const withSalesType = (query, salesType /* -1|0|1 */) => {
    const qs = new URLSearchParams((query || '').replace(/^\?/, ''));
    if (salesType === -1 || salesType === undefined || salesType === null) {
      qs.delete('SalesType');
    } else {
      qs.set('SalesType', salesType);
    }
    const s = qs.toString();
    return s ? `?${s}` : '';
  };
const getSalesNo = (r) => {
  const v = r?.salesNo ?? r?.invoiceNo ?? r?.docNo;
  const n = Number(v);
  return Number.isFinite(n) ? n : v;  
};

const hasRealDdtd = (r) => {
  const raw = r?.vatDdtd ?? r?.lotteryNo;
  const s = raw == null ? '' : String(raw).trim().toLowerCase();
  return s !== '' && s !== 'service called';
};

const isRefund = (r) => {
  const st = r?.salesType ?? r?.SalesType;
  return st === 1 || st === '1';
};

  const selectedRows = useMemo(
  () => (data || []).filter(r => r?.checked),
  [data]
);
const selectedCount = selectedRows.length;
const selectedTotals = useMemo(
  () => calcTotals(selectedRows),
  [selectedRows]
);

const handleSendToTax = async () => {
  if (selectedRows.length < 1) {
    message.warning('Сонголт хийгээгүй байна.');
    return;
  }

  const payload = (selectedRows || [])
    .filter(r => !isRefund(r) && !hasRealDdtd(r)) 
    .map(r => ({
      salesNo: getSalesNo(r),
      txnType: 0,
    }));

  if (!payload.length) {
    message.warning('Илгээх боломжтой мөр алга (буцаалт эсвэл ДДТД аль хэдийн бий байна).');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    const res = await dispatch(sendRequest(user, token, 'Txn/SalesVat', payload));
    if (res?.error) {
      message.error(res.error?.message || 'Илгээх үед алдаа гарлаа.');
      setError(res.error);
    } else {
      message.success(`Татварт ${payload.length} баримт илгээлээ.`);
      getData(filter); 
    }
  } finally {
    setLoading(false);
  }
};


function calcTotals(rows = []) {
  const get = (r, ks) => {
    for (const k of ks) {
      const v = r?.[k];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  };
  const toNum = (v) => Number(v) || 0;

  const stKey  = ['SalesType', 'salesType', 'typeCode'];
  const amtKey = ['docAmount', 'totalAmount', 'grandTotal', 'amount', 'totalSalesAmount'];
  const vatKey = ['totalVatAmount', 'vat', 'taxAmount'];

  return rows.reduce((acc, r) => {
    const st  = get(r, stKey);
    const amt = toNum(get(r, amtKey));
    const vat = toNum(get(r, vatKey));
  
    acc.totalQty += 1;
    acc.totalAmt += amt;
  
    acc.filteredAmount += amt;  
    acc.filteredVat    += vat;
  
    if (String(st) === '1') { 
      acc.returnQty += 1; 
      acc.returnAmt += amt; 
      acc.returnVat += vat; 
    } else { 
      acc.salesQty += 1; 
      acc.salesAmt += amt; 
      acc.salesVat += vat;   
    }
    return acc;
  }, {
    totalQty: 0, totalAmt: 0,
    salesQty: 0, salesAmt: 0, salesVat: 0,   
    returnQty: 0, returnAmt: 0, returnVat: 0, 
    filteredAmount: 0, filteredVat: 0, 
  });  
}

  const onClickDelete = () => setOpen(true);

  const confirm = async (sure) => {
    setOpen(false);
    if (sure) {
      let toDelete = [];
      data?.forEach((item) => {
        if (item.checked) {
          item.rowStatus = 'D';
          toDelete.push(item);
        }
      });
      setLoading(true);
      setError(null);
      const response = await dispatch(sendRequest(user, token, 'Site/Customer', toDelete));
      setLoading(false);
      setShow(false);
      if (response?.error) setError(response?.error);
      else {
        message.success(t('customer.delete_success'));
        getData(filter);
      }
    }
  };

  const onClickAdd = (row) => {
    setVisible(true);
    setItem(row?.original);
  };

  const closeModal = (toGet) => {
    setVisible(false);
    setItem(null);
    if (toGet) getData();
  };

  const onDone = async () => setVisible1(false);
  const onClickImport = () => navigate('/customer/customer_sales_import');

  const onSearch3 = (filterFromFilter, queryFromHeader) => {
    const merged = (filterFromFilter || '') + (queryFromHeader || '');
    getData(withSalesType(merged, -1));
  };

  const emptyProps = {
    icon: 'MdSupervisorAccount',
    type: 'customer',
    noDescr: true,
    onClickAdd,
    isMd: true,
    onClickImport,
  };

  const modalProps = {
    visible,
    closeModal,
    selected: item,
    onSearch: getData,
    filter,
    data,
    branch,
    allBranch,
    getBranchs,
  };

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  const listProps = {
    data,
    onClickAdd,
    setData,
    loaded,
    setShow,
    checked,
    setChecked,
    excelName,
    onClickDelete,
    show,
    setError,
    onSearch: getData,
    columns: columnOptions,
    value: colMenuValue,
    setValue: setColMenuValue,
    className: 'rp_list_drop',
    onSendToTax: handleSendToTax,
  };

  const subProps = { visible: visible1, setVisible: setVisible1, onDone };
  const videoData = [{ id: 'v_Up6Wi08PQ' }];

  return (
    <div className="s_container_i" style={{ maxWidth }}>
      {visible1 && <Subscription {...subProps} />}
      {visible && <Add {...modalProps} />}

      <div style={{ flex: '1 1 auto' }}>
        <Overlay loading={loading}>
          <SizeMe monitorWidth>
            {({ size }) => (
              <>
                <Header
                  size={size}
                  onSearch={onSearch3}
                  filter={filter}
                  columns={[]}
                  excelName={excelName}
                  value={undefined}
                  setValue={() => { }}
                  data={[]}
                  className="your-class"
                  date={null}
                  data1={data}
                  setError={setError}
                  invt={invt}
                  setInvt={setInvt}
                  hideToolbar={true} 
                  afterFilter={
                  <div style={{ margin: '8px 0' }}>
                    <Card size={size} total={selectedTotals} />
                  </div>
                }
                />

                {open && <Confirm {...confirmProps} />}
                {error && <Error1 error={error} />}

                {!data?.length && !filtering ? (
                  <Empty2 {...emptyProps} />
                ) : (
                  <div className="i_list_cont_z" id="solve_list2">
                    <List
                    {...listProps}
                    size={size}
                    onSearch={(_, q) => onSearch3(filter, q)}
                    data1={data}
                  />
                  </div>
                )}
              </>
            )}
          </SizeMe>
        </Overlay>
      </div>

      <Help videoData={videoData} />
    </div>
  );
}

export default CustomerSales;
