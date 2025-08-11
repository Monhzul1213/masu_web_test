import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, Input, MoneyInput } from '../../../../components/all';

export function ModalWhole(props){
  const { visibleWhole, closeWhole, selected, setData } = props;
  const { t } = useTranslation();
  const [price, setPrice] = useState({ value: '' });
  const [qty, setQty] = useState({ value: '' });

  useEffect(() => {
    setPrice({ value: selected?.original?.wholePrice ?? 0 });
    setQty({ value: selected?.original?.wholeQty ?? 0 });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    let wholePrice = parseFloat(price?.value ? price?.value : 0);
    let wholeQty = parseFloat(qty?.value ? qty?.value : 0);
    if(wholePrice && wholeQty){
      setData(old => old.map((row, index) => {
        if(selected?.original?.invtId === row?.invtId)
          return {...old[index], useWholePrice: 'Y', wholePrice, wholeQty};
        else
          return row;
      }));
      closeWhole();
    } else {
      if(!wholePrice) setPrice({...price, error: t('error.not_empty') })
      if(!wholeQty) setQty({...qty, error: t('error.not_empty') })
    }
  }

  const onChangeQty = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setQty({...value, error: 'must_number'});
    else setQty({ value: text });
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visibleWhole} centered={true} width={400}>
      <div className='m_back'>
        <p className='m_title'>{t('inventory.t_wholeprice')}</p>
        <div className='m_scroll'>
          <form onSubmit={onClickSave}>
            <MoneyInput
              value={price}
              setValue={setPrice}
              label={t('inventory.price')}
              placeholder={t('inventory.price')} />
            <Input
              value={qty}
              setValue={onChangeQty}
              label={t('inventory.t_qty')}
              placeholder={t('inventory.t_qty')} />
            <div style={{padding: 1}} />
          </form>
        </div>
      </div>
      <ButtonRow
        onClickCancel={closeWhole}
        onClickSave={onClickSave}
        type='submit'
        isModal={true} />
    </Modal>
  );
}