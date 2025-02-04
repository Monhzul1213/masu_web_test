import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx";

import { getList } from '../../../../services';
import { ButtonRow, Error, Overlay, UploadDrag } from '../../../all';
import { ExportExcel3, add, divide, excelTypes } from '../../../../helpers';

export function Import(props){
  const { visible, closeModal, data, setData, setVisible, newItem, setTotal, columns, setTotal1} = props;
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
          item.barCode = item?.Баркод
          item.orderTotalQty = item?.Нийт_захиалсан_тоо
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
    let response = await dispatch(getList(user, token, 'Inventory/GetInventory'))
    response?.data?.inventoryies?.forEach(element => {
      let index = jsonData?.findIndex(item => item?.barCode?.toString() === element?.msInventory?.barCode);
      if(index !== -1){
        let total = 0;
        let exists = data?.findIndex(d => d.invtId === element?.msInventory?.invtId);
        if(exists === -1){
          let orderQty1 = divide(jsonData[index]?.orderTotalQty, element?.msInventory?.batchQty ?? 1);
          let amt = orderQty1?.toString()?.split(".", 2 );
          let orderQty = amt[0];
          let totalCost = divide(jsonData[index]?.orderTotalQty, element?.msInventory?.cost, true);
          total = add(total, totalCost);
          setTotal1(total);      
          let list = newItem(element?.msInventory, orderQty, jsonData[index]?.orderTotalQty, totalCost);
          setData(old => [...old, list])
        } else {
          setData(old => old.map((row, ind) => {
            if(ind === exists){
              let orderQty1 = divide(jsonData[index]?.orderTotalQty, element?.msInventory?.batchQty ?? 1);
              let amt = orderQty1?.toString()?.split(".", 2 );
              let orderQty = amt[0];
              let orderTotalQty = jsonData[index]?.orderTotalQty;
              let totalCost = divide(orderTotalQty, element?.msInventory?.cost, true);
              total = add(total, totalCost);
              setTotal(total); 
              return { ...old[exists], orderQty, orderTotalQty, totalCost}
            } else {
              total = add(total, row.totalCost);
              setTotal(total);
              return row;
            }
          }));
        }
      } 
      // else setError(t('inventory.import_error1'));
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
                <p className='ii_title'>{t('inventory.import_title')}</p>
                <ExportExcel3 text={t('inventory.import_link')} columns={columns} excelData={data} fileName={'Baraa_Format'}/>
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