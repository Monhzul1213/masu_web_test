import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '../../all';

export function List(){
  // const { data, tab, size } = props;
  const { t } = useTranslation();

  const exportProps = { label: t('page.export'), className: 'rp_list_select', data: t('report_receipt.export') };

  return (
    <div className='rp_list'>
      <div className='rp_list_filter'>
        <Dropdown {...exportProps}  />
      </div>
    </div>
  );
}