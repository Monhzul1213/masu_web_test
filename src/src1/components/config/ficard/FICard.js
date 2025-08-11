import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getItem } from '../../../../helpers';
import { Title } from './Title';
// import { getList } from '../../../../services';

export function FICard({size}){
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname?.split('/') && pathname?.split('/')[3];
  // const [subscriptionType, setSubscriptionType] = useState(false);
  const {user: { msRole } } = useSelector(state => state.login);
  // const dispatch = useDispatch();

  useEffect(() => {
    // getConfig();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  
  const items = [
    getItem(t('finance.finance_status'), 'fi_status', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.income_detail'), 'in_detail', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.cash_transaction'), 'transaction', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.equity_changes'), 'equity', null, null, null, msRole?.webEditSettings !== 'Y'),
  ];

  const items1 = [
    getItem(t('finance.balance_report'), 'balance', null, null, null, msRole?.webManageSite !== 'Y'),
    getItem(t('finance.account_statement'), 'account', null, null, null, msRole?.webManagePos !== 'Y'),
    getItem(t('finance.report_GLJournal'), 'glreport', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.journalList'), 'journalList', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.workSheet'), 'workSheet', null, null, null, msRole?.webEditSettings !== 'Y')
  ];
  const items2 = [
    getItem(t('finance.cash_summary_report'), 'cash_summary', null, null, null, msRole?.webManageSite !== 'Y'),
    getItem(t('finance.cash_transaction_report'), 'cash_transaction', null, null, null, msRole?.webManagePos !== 'Y'),
    getItem(t('finance.daily_cash_report'), 'daily_cash', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.bank_account_summary_report'), 'bank_account_summary', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.bank_transaction_report'), 'bank_transaction', null, null, null, msRole?.webEditSettings !== 'Y'),
    getItem(t('finance.daily_bank_report'), 'daily_bank', null, null, null, msRole?.webEditSettings !== 'Y')
  ];

  const onClick = e => navigate(e?.key);

  const sTitleProps = { title: t('finance.finance_report') };
  const sMenuProps = { items, onClick, className: 'finance_menu', selectedKeys: [path] };
  const pTitleProps = { title: t('finance.generel_journal'), sub_title: t('config.store_config'), icon: 'BsShop', color: '#a020f0cc' };
  const pMenuProps = { items: items1, onClick, className: 'finance_menu', selectedKeys: [path] };
  const cTitleProps = { title: t('finance.cash_flow') };
  const cMenuProps = { items: items2, onClick, className: 'finance_menu', selectedKeys: [path] };

  return (
    <div className='fi_card_back' >
      <Title {...sTitleProps} />
      <Menu {...sMenuProps} />
      <Title {...pTitleProps} />
      <Menu {...pMenuProps} />
      <Title {...cTitleProps} />
      <Menu {...cMenuProps} />
    </div>
  );
}