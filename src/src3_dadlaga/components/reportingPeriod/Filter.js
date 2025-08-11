import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
 
import { getList } from '../../../services';
import { PlainSelect, ButtonRow } from '../../../components/all';
import { Modal } from 'antd';
 
export function Filter(props) {
  const {
    size,
    onSearch,
    periodType = 'HY',
    edited = false,
    onSave,
    setEdited,
  } = props;
 
  const { t } = useTranslation();
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingYear, setPendingYear] = useState(null);
 
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
 
  const onFocusYear = async () => {
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/getPeriod'));
    setLoading(false);
 
    const serverPeriods = response?.data?.periods || [];
    const allYearsFromServer = [...new Set(serverPeriods.map(p => Number(p.year)))];
 
    const currentYear = new Date().getFullYear();
    const fakeYears = [];
    for (let i = 0; i < 3; i++) {
      const fakeYear = currentYear - i;
      if (!allYearsFromServer.includes(fakeYear)) {
        fakeYears.push(fakeYear);
      }
    }
 
    const allYears = [...allYearsFromServer, ...fakeYears];
    const uniqueSortedYears = [...new Set(allYears)].sort((a, b) => b - a);
    const options = uniqueSortedYears.map(y => ({ id: y, name: `${y}` }));
    setYears(options);
 
    if (!uniqueSortedYears.includes(year)) {
      const latest = uniqueSortedYears[0];
      setYear(latest);
      triggerSearch(latest);
    }
  };
 
  const triggerSearch = (val) => {
    const params = new URLSearchParams();
    params.append('Year', val);
    if (periodType) params.append('PeriodType', periodType);
    const query = `?${params.toString()}`;
    onSearch && onSearch(query);
  };
 
  const onChangeYear = (val) => {
    if (edited) {
      setPendingYear(val);
      setShowConfirm(true);
    } else {
      setYear(val);
      triggerSearch(val);
    }
  };
 
  const handleConfirmChange = async () => {
    const success = await onSave?.();
    if (success) {
      setEdited?.(false);
      setYear(pendingYear);
      triggerSearch(pendingYear);
      setShowConfirm(false);
    }
  };
 
  const id = size?.width > 870 ? 'ih_large' : 'ih_small';
  const classBack = 'th_select_back';
  const classLabel = 'ih_select_lbl';
  const className = 'ih_select';
  const bStyle = {
    maxWidth: size?.width > 780 ? 180 : (((size?.width ?? 200) - 52) / 2),
  };
 
  const yearProps = {
    value: year,
    setValue: onChangeYear,
    data: years,
    s_value: 'id',
    s_descr: 'name',
    label: t('reporting.period.year'),
    onFocus: onFocusYear,
    loading,
    classBack,
    classLabel,
    className,
    bStyle,
  };
 
  return (
    <>
      <div className='ih_header' id={id}>
        <div className='th_header1'>
          <div className='th_header_s'>
            <PlainSelect {...yearProps} />
          </div>
        </div>
      </div>
 
      <Modal
        title={null}
        footer={null}
        closable={false}
        open={showConfirm}
        centered
        width={360}
        destroyOnClose
      >
        <div className="m_back">
          <p className="m_title" id="m_confirm">
            {t('reporting.period.confirm')}
          </p>
          <p className="m_descr">{t('reporting.period.back_confirm')}</p>
        </div>
        <ButtonRow
          onClickCancel={() => setShowConfirm(false)}
          onClickSave={handleConfirmChange}
          text1="reporting.period.no"
          text2="reporting.period.yes"
        />
      </Modal>
    </>
  );
}