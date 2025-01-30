import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx";

import { sendRequest } from '../../../../../services';
import { ButtonRow, Error, Overlay, UploadDrag } from '../../../../../components/all';
import { ExportExcel4, add, excelTypes } from '../../../../../helpers';
// import FormatSheet from '../../../../assets/Count_Format.xlsx';

export function Import(props){
  const { visible, closeModal, data, setData, setVisible, columns, siteId} = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleConvert = () => {
    if(file?.object) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        json?.forEach(item => {
          item.name = item?.Бараа
          item.barCode = item?.Баркод
          item.countedQty = item?.Тоолсон_тоо
        });
        onSave(json);
      };
      reader.readAsBinaryString(file?.object);
    }
    else {
      setError(t('inventory.import_error'));
    }
  };

  const onSave = async (jsonData) => {
    setError(null);
    setLoading(true);
    let filter = [{ fieldName: "SiteID", value: siteId?.value }];
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
    response?.data?.forEach(element => {
      let index = jsonData?.findIndex(item => item?.barCode?.toString() === element?.msInventory?.barCode);
      if(index !== -1){
        let exists = data?.findIndex(d => d.invtId === element?.msInventory?.invtId);
        if(exists !== -1){    
          setData((old = []) => old.map((row, ind) => {
            if(ind === exists && old[exists] && typeof old[exists] === "object"){
              let countedQty = jsonData[index]?.countedQty ?? 0;
              let varianceQty = add(countedQty, old[exists]?.countQty ?? 0, true);
              let itemStatus = 1;
              return { ...old[exists], countedQty, varianceQty, itemStatus }
            } 
              return row;
          }));
        }
      } 
      else setError(t('inventory.import_error1'));
      setVisible(false);
    });
    setLoading(false);
  }

  const uploadProps = { file, setFile, types: excelTypes };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave: handleConvert };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={600}>
      <Overlay className='i_container' loading={loading}>
        <div className='i_scroll'>
            <div className='ma_back'>
            <div className='ii_header'>
                <p className='ii_title'>{t('count.import_title')}</p>
                {/* <a className='ii_link' href={FormatSheet} download='Count_Format.xlsx'>{t('count.import_link')}</a> */}
                <ExportExcel4 text={t('count.import_link')} columns={columns} excelData={data} fileName='Count_Format'/>
            </div>
            <UploadDrag {...uploadProps}/>
            </div>
        </div>
        {error && <Error error={error} id = 'i_error' />}
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}