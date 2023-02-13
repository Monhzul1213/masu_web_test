import React, { useState } from 'react';
import { Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';

import '../../../../css/config.css'
import { DynamicAIIcon, DynamicMDIcon, Step } from '../../../all';
import { formatNumber, subscriptions } from '../../../../helpers';

export function Subscription(props){
  const { visible, setVisible } = props;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(0);

  const closeModal = () => setVisible(false);

  const onDone = async () => {

  }

  const typeProps = { selected, setSelected };
  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Payment', content: 'Second-content' }
  ];
  const stepProps = { current, steps, setCurrent, onDone };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={440}>
      <div className='m_back2'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={closeModal} />
        <Steps current={current} items={steps} />
        <div>{steps[current]?.content}</div>
        <div className='gap' />
        <Step {...stepProps} />
      </div>
    </Modal>
  );
}

function Type(props){
  const { selected, setSelected } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    const active = selected === item?.value;
    const id = active ? 'es_type_btn_active' : 'es_type_btn_inactive';

    return (
      <button className='es_type_btn' id={id} key={index} onClick={() => setSelected(item?.value)}>
        <div className='es_type_side'>
          <p className='es_type_title'>
            {formatNumber(item?.amt)}
            <span className='es_type_sub'>₮/{item?.length}</span>
          </p>
          <p className='es_type_descr'>{item?.text}</p>
        </div>
        <DynamicMDIcon className='es_type_icon'
          name={active ? 'MdOutlineRadioButtonChecked' : 'MdOutlineRadioButtonUnchecked'} />
      </button>
    );
  }

  return (
    <div className='es_scroll'>
      <p className='es_title'>{t('employee.add')}</p>
      <p className='es_text'>{t('employee.sub_text')}</p>
      <div className='es_types'>
        {subscriptions?.map(renderItem)}
      </div>
    </div>
  );
}