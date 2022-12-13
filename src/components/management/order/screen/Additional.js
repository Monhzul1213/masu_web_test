import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, useSortBy } from 'react-table';

import { formatNumber } from '../../../../helpers';
import { TableRow } from '../../../all';

export function Additional(props){
  const { data } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('order.t_name'), accessor: 'addCostName', noSort: true,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_amt')}</div>, accessor: 'addCostAmount', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}>₮{formatNumber(value)}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const tableInstance = useTable({ columns, data }, useSortBy);
  const tableProps = { tableInstance, scrolling: true };
  
  return (
    <div className='ps_list_back1'>
      <TableRow {...tableProps} />
    </div>
  );
}