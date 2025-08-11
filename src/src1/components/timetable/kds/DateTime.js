import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function DateTime() {
  const [now, setNow] = useState(new Date());
  const { t } = useTranslation();


  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => n.toString().padStart(2, '0');
  const date = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
      {t('page.date')} {date} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {t('page.time')} {time}
    </div>
  );
}
