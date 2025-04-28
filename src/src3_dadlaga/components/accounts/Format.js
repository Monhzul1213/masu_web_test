import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadDrag } from '../../../components/all';
import { AcctExcel, excelTypes } from '../../../helpers';
 
 
 
export function Format(props){
  const { data, setFile, file } = props
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
 
  const columnWidths = [
    { wch: 15 }, // width for column A
    { wch: 15 }, // width for column B
    { wch: 20 }, // width for column C
    { wch: 25 }, // width for column D
    { wch: 25 }, // width for column E
    { wch: 15 }, // width for column F
    { wch: 15 }, // width for column G
    { wch: 25 }, // width for column H
  ];
 
  useEffect(() => {
    setColumns([
      { Header: t('account.acct'), accessor: 'acct', exLabel:t('account.acct')},
      { Header: t('account.acctTy'), accessor: 'acctType', exLabel: t('account.acctTy') },
      { Header: t('account.acctClassId'), accessor: 'acctClassId', exLabel:t('account.acctClassId')},
      { Header: t('account.acctClassName'), accessor: 'acctClassName', exLabel:t('account.acctClassName'),},
      { Header: t('transModel.acctName'), accessor: 'acctName', exLabel:t('transModel.acctName'),},
      { Header: t('account.currency'), accessor: 'currency', exLabel: t('account.currency')},
      { Header: t('account.siteId'), accessor: 'siteId', exLabel: t('account.siteId')},
      { Header: t('account.siteName'), accessor: 'siteName', exLabel:t('account.siteName') },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);


  const uploadProps = { file, setFile, types: excelTypes };
 
  return (
      <div className='ma_back'>
          <div className='ii_header'>
            <p className='ii_title'>{t('account.import_title')}</p>
            <AcctExcel
              text={t('account.import_link')} columns={columns}  excelData={data} fileName={'Dans_Format'} width={columnWidths} applyBorder={true}
            />
          </div>
          <UploadDrag {...uploadProps} />
        </div>
 
  );
}