import React, { useEffect, useState, useRef } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { getList } from '../../../../services';
import { Empty1, Error1, Overlay } from '../../../../components/all';
import { List, Filter } from '../../../../src3_dadlaga/components/reportingPeriod';

export function ReportPeriod(props){
    const { showPeriod } = props;
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
      console.warn('Config data is missing from GetConfig response.');
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
      } else {
        const filtered = result.filter(
          (p) => p.periodType === periodTypeOverride && Number(p.year) === yearParam
        );
  
        let periods = [];
        if (filtered.length === 0) {
          const count =
            periodTypeOverride === 'HY' ? 2 :
            periodTypeOverride === 'M' ? 12 :
            periodTypeOverride === 'Y' ? 1 : 4;
  
          periods = Array.from({ length: count }, (_, i) => ({
            id: `fake-${yearParam}-${i + 1}`,
            year: yearParam,
            period: `${i + 1}`,
            type: typeMapping[periodTypeOverride],
            periodType: periodTypeOverride,
            status: 0,
            isLocked: 'N',
          }));
        } else {
          periods = filtered.map((item, index) => ({
            ...item,
            id: `${item.year}-${item.period}-${index}`,
            type: typeMapping[item.periodType] || item.periodType,
            isActive: item.status === 1 ? 1 : 0,
            periodType: item.periodType,
          }));
        }
  
        setAllData(
          periods.sort((a, b) => a.year - b.year || Number(a.period) - Number(b.period))
        );
      }
  
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
    <Modal title={null} footer={null} closable={false} open={showPeriod} centered={true} width={400}>
        <Overlay loading={loading}>
          <SizeMe>
            {({ size }) => (
              <div className="i_list_cont1" id="reportingPeriodList">
                <Filter
                  {...headerProps}
                  size={size}
                  edited={edited}
                  onSave={onSave}
                  setEdited={setEdited}
                />
                {!allData?.length ? (
                  <Empty1 icon="MdOutlineArticle" />
                ) : (
                  <List ref={listRef} {...listProps} size={size} />
                )}
              </div>
            )}
          </SizeMe>
          {error && <Error1 error={error} />}
        </Overlay>
    </Modal>
  );
}