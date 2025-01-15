import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx";

import { getList } from '../../../../../services';
import { ButtonRow, Error, Overlay, UploadDrag } from '../../../../../components/all';
import { add, excelTypes } from '../../../../../helpers';
import FormatSheet from '../../../../assets/Count_Format.xlsx';

export function Import(props){
  const { visible, closeModal, data, setData, setVisible, newItem} = props;
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
    console.log(jsonData);
    setError(null);
    setLoading(true);
    let response = await dispatch(getList(user, token, 'Inventory/GetInventory'))
    response?.data?.inventoryies?.forEach(element => {
      let index = jsonData?.findIndex(item => item?.barCode?.toString() === element?.msInventory?.barCode);
      if(index !== -1){
        let exists = data?.findIndex(d => d.invtId === element?.msInventory?.invtId);
        if(exists === -1){
          // let orderQty1 = divide(jsonData[index]?.orderTotalQty, element?.msInventory?.batchQty ?? 1);
          // let amt = orderQty1?.toString()?.split(".", 2 );
          // let orderQty = amt[0];
          // let totalCost = divide(jsonData[index]?.orderTotalQty, element?.msInventory?.cost, true);
          // total = add(total, totalCost);
          // setTotal1(total);     
          let countedQty = jsonData[index]?.countedQty
          let varianceQty = add(countedQty, jsonData[index]?.countQty, true);
          // let itemStatus = 1;
          let list = newItem(element?.msInventory, countedQty, varianceQty, );
          setData(old => [...old, list ])
        } 
        else {
          setData(old => old.forEach((row, ind) => {
            if(ind === exists){
              let countedQty = jsonData[index]?.countedQty;
              let varianceQty = add(countedQty, old[exists]?.countQty, true);
              console.log(old[ind]?.countQty, ind)
              // let itemStatus = 1;
              return { ...old[exists], countedQty, varianceQty }
            } 
          }));
        }
      } 
      else setError(t('inventory.import_error1'));
      // setTotal(total)
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
                <a className='ii_link' href={FormatSheet} download='Count_Format.xlsx'>{t('count.import_link')}</a>
                {/* <ExportExcel3 text={t('count.import_link')} columns={columns} excelData={data} fileName={'Count_Format'}/> */}
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