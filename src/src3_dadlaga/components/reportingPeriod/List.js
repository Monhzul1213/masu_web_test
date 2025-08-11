import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { TableResize, Empty1, ButtonRow } from '../../../components/all';
import { Modal, Switch, message } from 'antd';
import { getList, sendRequest } from '../../../services';
import moment from 'moment';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { ReportingJournalAdd } from '../../../src3_dadlaga/pages/reportingPeriod/ReportingJournalAdd';
import '../../../src3_dadlaga/css/tree.css';

export const List = forwardRef((props, ref) => {
  const { data, size, onSuccess, onError, setEdited, selectedYear } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);

  const [reportingPeriods, setReportingPeriods] = useState([]);
  const [columns, setColumns] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState(null);
  const [initialJournalData, setInitialJournalData] = useState(null);
  const [activePeriodId, setActivePeriodId] = useState(null);
  const [maxHeight, setMaxHeight] = useState('300px');

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmPeriod, setConfirmPeriod] = useState(null);
  const [confirmJournalId, setConfirmJournalId] = useState(null);
 
  const getDatesForPeriod = (year, period, periodType = 'S') => {
    const p = Number(period);
    let start;
    if (periodType === 'S') {
      start = moment(`${year}-${(p - 1) * 3 + 1}-01`);
      return {
        beginDate: start.toISOString(),
        endDate: moment(start).add(3, 'months').subtract(1, 'day').endOf('day').toISOString()
      };
    }
    if (periodType === 'M') {
      start = moment(`${year}-${String(p).padStart(2, '0')}-01`);
      return {
        beginDate: start.toISOString(),
        endDate: start.endOf('month').endOf('day').toISOString()
      };
    }
    if (periodType === 'HY') {
      start = moment(`${year}-${p === 1 ? '01' : '07'}-01`);
      return {
        beginDate: start.toISOString(),
        endDate: moment(start).add(6, 'months').subtract(1, 'day').endOf('day').toISOString()
      };
    }
    if (periodType === 'Y') {
      return {
        beginDate: moment(`${year}-01-01`).toISOString(),
        endDate: moment(`${year}-12-31`).endOf('day').toISOString()
      };
    }
    return { beginDate: '', endDate: '' };
  };
 
  const onClickLink = async (row) => {
   
    const journalId1 = row?.original?.journalId;
    const item = row.original;
    setActivePeriodId(item.id);
    const { beginDate, endDate } = getDatesForPeriod(item.year, item.period, item.periodType);
 
    const query = {
      storedName: 'uspgl_GET_glJournalClose',
      moduleID: 'IN',
      business: [
        { fieldName: 'BeginDate', value: moment(beginDate).format('YYYY.MM.DD') },
        { fieldName: 'EndDate', value: moment(endDate).format('YYYY.MM.DD') },
        { fieldName: 'MerchantId', value: user?.merchantId },
        { fieldName: 'PeriodType', value: item.periodType },
        { fieldName: 'Year', value: item.year },
        { fieldName: 'Period', value: item.period }
      ]
    };
 
    try {
        const res = await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        const journal = res?.data?.glJournal?.[0];
        const journalItems = res?.data?.glJournalItem ?? [];
        const journalId = journal?.journalId ?? journal?.id ?? journal?.glJournalId ?? null;
 
        if (Number(item.status) === 1) {
          setSelectedJournalId(journalId);
          setInitialJournalData(journal ? { journal, journalitem: journalItems } : { journal: {}, journalitem: [] });
          setModalVisible(true);
        } else {
          setConfirmPeriod({ ...item, beginDate, endDate });
          setConfirmJournalId(journalId1);
          setConfirmModalOpen(true);
        }
      } catch {
      }
  };
 
  const confirmOpenPeriod = async () => {
  if (!confirmPeriod) return;

  const item = confirmPeriod;

  const updatePayload = [{
    periodType: item.periodType,
    year: Number(item.year),
    period: Number(item.period),
    beginDate: item.beginDate,
    endDate: item.endDate,
    journalId: null,
    status: 1,
    isLocked: 'N',
    lastUserID: user?.userID,
    lastUpdate: new Date().toISOString()
  }];

  const openPeriodRes = await dispatch(sendRequest(user, token, 'Merchant/ModPeriod', updatePayload));
  if (openPeriodRes?.error) {
    return;
  }

  const response = await dispatch(getList(user, token, `Txn/GetJournal?JournalID=${confirmJournalId}`));
  if (response?.error) {
    return;
  }

  await GetData1(response?.data?.journal);

  const updated = reportingPeriods.map(p =>
    p.id === item.id ? { ...p, journalId: null, status: 1, isLocked: 'N' } : p
  );
  setReportingPeriods(updated);
  setEdited?.(true);
  setConfirmModalOpen(false);
  message.success(t("reporting.period.open_success"));
};

 
  const GetData1 = async (data) => {
  if (!confirmJournalId || !data) return;

  const cleanedData = Array.isArray(data) ? data[0] : data;
  if (!cleanedData) return;

  const deletePayload = {
    journalID: confirmJournalId,
    descr: cleanedData?.descr ?? '',
    txnDate: cleanedData?.txnDate,
    totalAmt: cleanedData?.totalAmt ?? 0,
    sourceType: cleanedData?.sourceType ?? 0,
    sourceID: cleanedData?.sourceID ?? 0,
    custID: cleanedData?.custId ?? 0,
    status: 0,
    templateID: cleanedData?.templateId ?? 0,
    rowStatus: 'D',
    items: [
      {
        journalItemID: 0,
        acct: '',
        drAmt: 0,
        crAmt: 0,
        itemDescr: '',
        rowStatus: 'D'
      }
    ]
  };

  console.log('Deleting with payload:', deletePayload);

  const deleteRes = await dispatch(sendRequest(user, token, 'Txn/ModJournal', deletePayload));

  if (deleteRes?.error || deleteRes?.code === 1001) {
    return;
  }

  console.log('Journal deleted successfully');
};

  const handleModalClose = async (result) => {
  setModalVisible(false);
  setInitialJournalData(null);
  setSelectedJournalId(null);
 
  if (result?.saved && activePeriodId !== null) {
    const item = reportingPeriods.find(p => p.id === activePeriodId);
    if (!item) return;
 
    const payload = [{
      periodType: item.periodType,
      year: Number(item.year),
      period: Number(item.period),
      journalId: result.journalId,
      status: 0,
      isLocked: 'N',
    }];
 
    const saveRes = await dispatch(sendRequest(user, token, 'Merchant/ModPeriod', payload));
    if (!saveRes?.error) {
      const updated = reportingPeriods.map(p =>
        p.id === item.id
          ? { ...p, journalId: result.journalId, status: 0, isLocked: 'N' }
          : p
      );
      setReportingPeriods(updated);
      setEdited?.(true);
    }
  }
  setActivePeriodId(null);
};
 
 
  const handleToggle = (id, newValue) => {
    const updated = reportingPeriods.map(item =>
      item.id === id && Number(item.status) === 1
        ? { ...item, isLocked: newValue ? 'Y' : 'N' }
        : item
    );
    setReportingPeriods(updated);
  };
 
  const handleSave = async () => {
    const groupedByYear = _.groupBy(reportingPeriods, 'year');
    try {
      for (const year in groupedByYear) {
        const payload = groupedByYear[year].map(item => {
          const { beginDate, endDate } = getDatesForPeriod(item.year, item.period, item.periodType);
          return {
            periodType: item.periodType,
            year: Number(item.year),
            period: Number(item.period),
            beginDate,
            endDate,
            isLocked: item.isLocked,
            status: item.status,
            journalId: item.journalId
          };
        });
        const res = await dispatch(sendRequest(user, token, 'Merchant/ModPeriod', payload));
        if (res?.code === 1001 || res?.error) {
          onError?.(res?.error || t('reporting.period.server_error'), true);
          return false;
        }
      }
      onSuccess?.(t('reporting.period.save_success'));
      return true;
    } catch {
      onError?.(t('reporting.period.server_error'), true);
      return false;
    }
  };
 
  useImperativeHandle(ref, () => ({ handleSave }));
 
  useEffect(() => {
    if (data?.length) setReportingPeriods(data);
  }, [data]);
 
  useEffect(() => {
    setColumns([
      {
        Header: t('reporting.period.type'),
        accessor: 'type',
        width: 100,
        minWidth: 150
      },
      {
        Header: t('reporting.period.title'),
        accessor: 'period',
        width: 100,
        minWidth: 150
      },
      {
        Header: t('journal.add'),
        accessor: 'isLocked',
        width: 100,
        minWidth: 150,
        isBtn: true,
        Cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Switch
              checked={row.original.isLocked === 'Y'}
              disabled={Number(row.original.status) === 0}
              onChange={val => {
                handleToggle(row.original.id, val);
                setEdited?.(true);
              }}
            />
          </div>
        )
      },
      {
        Header: <div style={{ textAlign: 'center' }}>{t('reporting.period.closure')}</div>,
        accessor: 'status',
        width: 100,
        minWidth: 150,
        isBtn: true,
        Cell: ({ row }) => {
          const isActive = Number(row.original.status) === 1;
          return (
            <div
              className="table_link"
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation();
                onClickLink(row);
              }}
            >
              {isActive ? t('reporting.period.close') : t('reporting.period.open')}
            </div>
          );
        }
      }
    ]);
  }, [i18n.language, reportingPeriods]);
 
  useEffect(() => {
    if (size?.width >= 830) {
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    } else if (size?.width >= 640) {
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 10px - 37px)');
    } else {
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 158px - 10px - 37px)');
    }
  }, [size?.width]);
 
  const visibleRows = useMemo(() => reportingPeriods.filter(p => Number(p.year) === Number(selectedYear)), [reportingPeriods, selectedYear]);
 
  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable(
    { columns, data: visibleRows, defaultColumn },
    useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns
  );
 
  return (
    <>
      <Modal open={modalVisible} closable={false} footer={null} width="auto" centered destroyOnClose>
        <ReportingJournalAdd isModal journalId={selectedJournalId} initialData={initialJournalData} periodRow={reportingPeriods.find(p => p.id === activePeriodId)} onClose={handleModalClose} />
      </Modal>
 
      <Modal open={confirmModalOpen} footer={null} closable={false} width={360} centered>
        <div className="m_back">
          <p className="m_title" id="m_confirm">{t('reporting.period.confirm_title')}</p>
          <p className="m_descr">{t('reporting.period.back_confirm_description')}</p>
        </div>
        <ButtonRow
          onClickCancel={() => setConfirmModalOpen(false)}
          onClickSave={confirmOpenPeriod}
          text1="reporting.period.no"
          text2="reporting.period.yes"
        />
      </Modal>
 
      {visibleRows.length === 0 ? (
        <Empty1 icon="MdOutlineArticle" text={t('reporting.period.empty')} />
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <div className="table_scroll" style={{ marginTop: 10, overflowY: 'auto', maxHeight, minWidth: 720 }}>
              <TableResize tableInstance={tableInstance} />
            </div>
          </div>
          <div id="reporting-period-btn-row">
            <ButtonRow
              onClickSave={handleSave}
              onClickCancel={() => {
                if (data?.length) setReportingPeriods(data);
                setEdited?.(false);
              }}
            />
          </div>
        </>
      )}
    </>
  );
});