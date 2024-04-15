import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export function Tab(props){
  const { page, setPage } = props;
  const { t } = useTranslation();

  return (
    <div className='pg_back'>
      <p className='ac_title1'>{t(page === 1 ? 'bonus.bonus_type' : 'bonus.bonus_give')}</p>
      <button className='pg_btn' disabled={page === 1} onClick={() => setPage(1)}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={page} disabled={true} />
        <p className='pg_text'>/ 2</p>
      </div>
      <button className='pg_btn' disabled={page === 2} onClick={() => setPage(2)}>
        <FiChevronRight className='pg_icon' />
      </button>
    </div>
  );
}