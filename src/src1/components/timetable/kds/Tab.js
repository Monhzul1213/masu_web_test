import React from 'react';
import '../../../css/kds.css';
import { useTranslation } from 'react-i18next';

export function Tab({ activeTab, setActiveTab, kdsData }) {
  let doingCount = 0;
  let readyCount = 0;
  const { t } = useTranslation();

  if (kdsData?.saleshold?.length) {
    doingCount = kdsData.saleshold.filter(order => order.kdsStatus !== 2).length;
  }

  if (kdsData?.saleshold_statustwo?.length) {
    readyCount = kdsData.saleshold_statustwo.filter(order => order.kdsStatus === 2).length;
  }

  return (
    <div className="kds-tabs">
      <div
        className={activeTab === 'doing' ? 'active' : ''}
        onClick={() => setActiveTab('doing')}
      >
        {t('kds.doing')} <span>({doingCount})</span>
      </div>
      <div
        className={activeTab === 'ready' ? 'active' : ''}
        onClick={() => setActiveTab('ready')}
      >
        {t('kds.done')} <span>({readyCount})</span>
      </div>
    </div>
  );
}

