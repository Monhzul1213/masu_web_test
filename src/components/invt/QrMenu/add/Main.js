import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Date, Select, Input } from '../../../../components/all';

export function Main(props) {
  const { setError, name, setName, beginDate, setBeginDate, endDate, setEndDate, status, setStatus } = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([{ value: 1, label: 'Идэвхитэй' }]);

  useEffect(() => {
    onFocusStatus();
     return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const onFocusStatus = () => {
    if (states?.length <= 1) {
      setStates([
        { value: 1, label: 'Идэвхитэй' },
        { value: 0, label: 'Идэвхигүй' },
      ]);
    }
  };
  
  return (
    <div className="cou_main_back">
      <div className="cou_add_back" style={{ maxWidth: '700px' }}>
        <Input
            value={name}
            setValue={setName}
            label={t('page.name')}
            placeholder={t('page.name')}
            setError={setError}
            length={100}
            inRow
          />
        <div className="ac_row" style={{ marginTop: 20 }}>
          <Date
            value={beginDate}
            setValue={setBeginDate}
            label={t('qrmenu.beginDate') || 'Эхлэх огноо'}
            inRow
          />
          <div style={{ width: 20 }} />
          <Date
            value={endDate}
            setValue={setEndDate}
            label={t('qrmenu.endDate') || 'Дуусах огноо'}
            inRow
          />

        </div>
        <Select
          value={status}
          setValue={setStatus}
          data={states}
          s_value="value"
          s_descr="label"
          label={t('qrmenu.status') || 'Төлөв'}
        />
      </div>
    </div>
  );
}
