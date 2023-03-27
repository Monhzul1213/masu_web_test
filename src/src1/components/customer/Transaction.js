import React, { useEffect, useState } from 'react';
import { Modal,  } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getList } from '../../../services';
import '../../../css/config.css'
import { Error, Overlay , ButtonRow2, Money} from '../all/all_m';
import { TranList } from './TranList';

export function Transaction(props){
  const { visible, closeModal, selected} = props;
  const { t,  } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible){
      let query = '?custId=' + selected?.custId
      getData(query)
    }
    
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const renderItem = (item) => {
    return (  
      <div className='sub_row'>
        <p className='sub_row_value'>
          {item?.txnType === 'D' ? t('customer.create') : t('customer.close') }
          <Money value={item?.txnType === 'D' ? item?.amount : (item?.amount)} fontSize={13} />
        </p>
        {/* <p className='sub_row_value'>{t('customer.close')}<Money value={item?.txnType === 'C' ? item?.amount : 0} fontSize={13} /></p> */}
      </div>
   
      
    )
  }

  const getData = async (query) => {
    setError(null);
    setLoading(true);
    let api = 'Site/GetCustomerTxn' + (query ?? '')
    const response = await dispatch(getList(user, token, api));
    console.log(response?.data)
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data?.txnLists)
      setData1(response?.data?.totalAmounts)

    }
    setLoading(false);
  }


  const btnProps = { onClickCancel: () => closeModal(), type: 'submit'};
  const listProps = { data, selected};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={770}>
      <Overlay loading={loading} className='m_back2'>
      <div className=''>
        <p className='es_title'>{t('system.cus_trans')}</p>
        <div className='sub_title'>
              {data1?.map(renderItem)}
            <div className='sub_row'>
              <p className='sub_row_label'>{t('customer.balance')}</p>
              <p className='sub_row_value'><Money value={selected?.arBalance} fontSize={13} /></p>
            </div>
        </div>
        <TranList {...listProps}/>
      </div>
        {error && <Error error={error} id = 'm_error' />}
        <ButtonRow2 {...btnProps} />
      </Overlay>
    </Modal>
  );
}


