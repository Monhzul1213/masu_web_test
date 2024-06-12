import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../css/report.css';
import { ExportExcel2 } from '../../../../helpers';

export function Header(props){
  const { columns, data, excelName,  } = props;
  const { t } = useTranslation();
 

  return (
    <div className='rp_list_filter_z1'>
        <ExportExcel2 text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
    </div>
  );
}