import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExportExcel } from '../../../helpers';
import '../../../css/report.css';

export function Header(props){
  const { t } = useTranslation();
  const {  columns, data, excelName } = props;


  
  return (
    <div className='ih_btn_row_z' >
      <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
    </div>
  );
}