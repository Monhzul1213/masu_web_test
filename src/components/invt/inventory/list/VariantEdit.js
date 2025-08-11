import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, Error, Input, ModalTitle, Overlay, MoneyInput } from '../../../all';

export function VariantEdit(props){
  const { visible, setVisible, selected, onSave } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [sku, setSku] = useState({ value: '' });
  const [barCode, setBarcode] = useState({ value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName({ value: selected?.variantName ?? '' });
    setPrice({ value: selected?.price ?? '' });
    setCost({ value: selected?.cost ?? '' });
    setSku({ value: selected?.sku ?? '' });
    setBarcode({ value: selected?.barCode ?? '' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(name?.value){
      setLoading(true);
      let data = { variantID: selected?.variantId, variantName: name?.value,
        price: parseFloat(price?.value ? price?.value : 0), cost: parseFloat(cost?.value ? cost?.value : 0),
        sku: sku?.value, barCode: barCode?.value?.trim(), rowStatus: 'U' };
      let response = await onSave(data);
      if(response?.error) setError(response?.error);
      else setVisible(false);
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError };
  const priceProps = { value: price, setValue: setPrice, label: t('inventory.price'), placeholder: t('inventory.price'), setError };
  const costProps = { value: cost, setValue: setCost, label: t('inventory.cost'), placeholder: t('inventory.cost'), setError };
  const skuProps = { value: sku, setValue: setSku, label: t('inventory.sku'), placeholder: t('inventory.sku'), setError };
  const barcodeProps = { value: barCode, setValue: setBarcode, label: t('inventory.barcode'), placeholder: t('inventory.barcode'), setError,
    handleEnter: onClickSave };
  const btnProps = { onClickCancel: () => setVisible(false), onClickSave, type: 'submit', show: false };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle title={t('inventory.edit_variant')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Input {...nameProps} />
              <div className='ac_row'>
                <MoneyInput {...priceProps} />
                <div className='gap' />
                <MoneyInput {...costProps} />
              </div>
              <Input {...skuProps} />
              <Input {...barcodeProps} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}