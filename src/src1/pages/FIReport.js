import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import '../css/config.css';
// import '../css/invt.css';
import {  AppModal } from '../../components/config';
import { FICard } from '../components/config/ficard/FICard';
import { GeneralJournal, Account, Balance, Journal, WorkSheet, DailyReport } from './finance/report/general_journal';
import { ReportStockholders, CashFlowReport, FinanceStatement, IncomeReport } from './finance/report/finance_report';

export function FIReport(props){
  const { size } = props;
  // const [row, setRow] = useState(true);
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const collapsed = useSelector(state => state.temp.collapsed);
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webEditSettings !== 'Y') navigate({ pathname: '/' });
    else {
      let mode = searchParams?.get('mode');
      if(mode === 'is_first') setVisible(true);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // let width = (size?.width ?? 1500) - 30 - (collapsed ? 72 : 300);
    // setRow(width > 800)
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, collapsed]);

  const closeModal = () => {
    setVisible(false);
    searchParams.delete('mode');
    setSearchParams(searchParams);
  }

  const modalProps = { visible, closeModal };

  return (
    <div className={'fi_back'} id='list_scroll' style={{maxWidth}}>
      {visible && <AppModal {...modalProps} />}
      <FICard size={size}/>
      <Routes>
        <Route path="/" element={<Navigate to="balance" replace />} />
        <Route path="*" element={<Navigate to="balance" replace />} />
        <Route path='fi_status' element={<FinanceStatement />} />
        <Route path='in_detail' element={<IncomeReport />} />
        <Route path='transaction' element={<CashFlowReport />} />
        <Route path='equity' element={<ReportStockholders/>} />
        <Route path='balance' element={<Balance/>} />
        <Route path='account' element={<Account />} />
        <Route path='glreport' element={<Journal />} />
        <Route path='journalList' element={<GeneralJournal />} />
        <Route path='workSheet' element={<WorkSheet />} />
        <Route path='cash_summary' element={<GeneralJournal />} />
        <Route path='cash_transaction' element={<GeneralJournal />} />
        <Route path='daily_cash' element={<GeneralJournal />} />
        <Route path='bank_account_summary' element={<GeneralJournal />} />
        <Route path='bank_transaction' element={<GeneralJournal />} />
        <Route path='daily_bank' element={<DailyReport />} />
      </Routes>
    </div>
  )
}