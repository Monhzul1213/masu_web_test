import React, { useEffect, useState, useRef } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactRouterPrompt from 'react-router-prompt';
import { Modal, message } from 'antd';

import '../../../css/order.css';
import '../../../css/invt.css';
import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { List, Filter } from '../../components/reportingPeriod';
import { Help } from '../../../components/invt/inventory/list';
import { ButtonRow } from '../../../components/all/ButtonRow';
import { useTranslation } from 'react-i18next';

export const ReportingPeriod = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);
  const [selectedPeriodType, setSelectedPeriodType] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [edited, setEdited] = useState(false);

  const listRef = useRef();
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.msRole?.webIsAdjust !== 'Y') {
      navigate({ pathname: '/' });
    } else {
      fetchConfigAndLoad();
    }
  }, []);

  const fetchConfigAndLoad = async () => {
  const res = await dispatch(getList(user, token, 'Merchant/GetConfig'));
  const config = res?.data;
  if (!config) {
  }

  const periodType = config?.periodType ?? 'HY';
  setSelectedPeriodType(periodType);

  const currentYear = new Date().getFullYear();
  setYear(currentYear);

  const query = `?Year=${currentYear}`;
  await onSearch(query, periodType);
};


  const onSearch = async (query, periodTypeOverride = selectedPeriodType) => {
  setError(null);
  setLoading(true);
  setSelectedPeriodType(periodTypeOverride);

  const params = new URLSearchParams(query);
  const yearParam = params.has('Year') ? parseInt(params.get('Year')) : new Date().getFullYear();
  setYear(yearParam);

  const fullQuery = `?Year=${yearParam}&PeriodType=${periodTypeOverride}`;
  const response = await dispatch(getList(user, token, 'Merchant/getPeriod' + fullQuery));
  const result = response?.data?.periods ?? [];
  const typeMapping = { S: 'Улирал', M: 'Сар', HY: 'Хагас жил', Y: 'Жил' };

  if (response?.error) {
    setError(response.error);
    setLoading(false);
    return;
  }

  const filtered = result.filter(
    (p) => p.periodType === periodTypeOverride && Number(p.year) === yearParam
  );

  const expectedCount =
    periodTypeOverride === 'HY' ? 2 :
    periodTypeOverride === 'M' ? 12 :
    periodTypeOverride === 'Y' ? 1 : 4;

  let periods = [];
  const existingPeriods = filtered.map(p => Number(p.period));

  for (let i = 1; i <= expectedCount; i++) {
    const existing = filtered.find(p => Number(p.period) === i);
    if (existing) {
      periods.push({
        ...existing,
        id: `${existing.year}-${existing.period}-${i}`,
        type: typeMapping[existing.periodType] || existing.periodType,
        isActive: existing.status === 1 ? 1 : 0,
        periodType: existing.periodType,
      });
    } else {
      periods.push({
        id: `fake-${yearParam}-${i}`,
        year: yearParam,
        period: `${i}`,
        type: typeMapping[periodTypeOverride],
        periodType: periodTypeOverride,
        status: 1,
        isLocked: 'N',
      });
    }
  }

  setAllData(
    periods.sort((a, b) => a.year - b.year || Number(a.period) - Number(b.period))
  );

  setLoading(false);
};


  const onClickCancel = () => {
    setEdited(false);
    navigate('/finance/reporting_period');
  };

  const onSave = async () => {
    if (listRef.current?.handleSave) {
      return await listRef.current.handleSave();
    }
    return false;
  };

  const listProps = {
    data: allData,
    onSuccess: async (msg) => {
      message.success(msg);
      setEdited(false);

      await new Promise((resolve) => setTimeout(resolve, 150));
      
      const query = `?Year=${year}`;
      await onSearch(query, selectedPeriodType);
    },
    onError: (msg) => message.error(msg),
    onClickCancel,
    setEdited,
    selectedYear: year,
  };

  const headerProps = {
    setError,
    onSearch,
    periodType: selectedPeriodType,
  };

  return (
    <>
      <ReactRouterPrompt when={edited}>
        {({ isActive, onConfirm, onCancel }) =>
          isActive && (
            <Modal title={null} footer={null} closable={false} open centered width={360}>
              <div className="m_back">
                <p className="m_title" id="m_confirm">
                  {t('reporting.period.confirm')}
                </p>
                <p className="m_descr">{t('reporting.period.back_confirm')}</p>
              </div>
              <ButtonRow
                onClickCancel={onCancel}
                onClickSave={async () => {
                  const success = await onSave();
                  if (success) {
                    setEdited(false);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    onConfirm();
                  }
                }}
                text1="page.no"
                text2="page.yes"
              />
            </Modal>
          )
        }
      </ReactRouterPrompt>

      <div className="s_container_i">
        <Overlay loading={loading}>
          {error && <Error1 error={error} />}
          <SizeMe>
            {({ size }) => (
              <div className="i_list_cont1" id="reportingPeriodList">
                <Filter {...headerProps} size={size} />
                {!allData?.length ? (
                  <Empty1 icon="MdOutlineArticle" />
                ) : (
                  <List ref={listRef} {...listProps} size={size} />
                )}
              </div>
            )}
          </SizeMe>
        </Overlay>
        <Help videoData={[{ id: 'ZGz0whjGSJY' }]} />
      </div>
    </>
  );
};