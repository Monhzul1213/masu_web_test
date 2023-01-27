import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getList } from '../../services';
import { ButtonRowAddConfirm, Empty, Error1, Overlay } from '../../components/all';
import { Add, List } from '../../components/config/cashier';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [types, setTypes] = useState([]);
  const [fields, setFields] = useState([]);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Txn/GetPayments'));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data?.paymenttype);
      setTypes(response?.data?.paymentsetup);
      setFields(response?.data?.paymentsetupdtl);
    }
  }


  const onClickDelete = async () => {
    // let toDelete = [];
    // data?.forEach(item => { if(item?.checked) toDelete?.push({ siteId: item?.siteId, terminalId: item?.terminalId }) });
    // setError(null);
    // setLoading('loading');
    // const response = await dispatch(deleteRequest(user, token, 'Site/DeletePos', toDelete));
    // if(response?.error) {
    //   setError(response?.error);
    //   setLoading(false);
    // }
    // else getPos(site);
  };

  const onClickAdd = row => {
    if(row?.original?.isDefault === 'N'){
      setVisible(true);
      setSelected(row?.original);
    }
  }

  const closeModal = toGet => {
    setVisible(false);
    setSelected(null);
    if(toGet) getData();
  }

  const width = size?.width >= 560 ? 560 : size?.width;
  const id = size?.width > 380 ? 'mo_large' : 'mo_small';
  const addProps = { type: 'cashier', onClickAdd, show, onClickDelete };
  const emptyProps = { icon: 'MdCreditCard', type: 'cashier', onClickAdd, noDescr: true };
  const listProps = { data, setData, setShow, checked, setChecked, onClickAdd };
  const modalProps = { visible, closeModal, selected, types, fields };
  
  return (
    <div className='store_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {visible && <Add {...modalProps} />}
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='mo_container' style={{ width }}>
            <div className='ih_header' id={id}>
              <ButtonRowAddConfirm {...addProps} />
            </div>
            <List {...listProps} />
          </div>
        }
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Cashier = withSizeHOC(Screen);
/*
comment
export function Cashier(){
  const closeModal = () => setVisible(null);

  const onChange = values => {
    setChecked(values);
    setShow(values?.length ? true : false);
  };
}
function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [showPos, setShowPos] = useState(true);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [show, setShow] = useState(false);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [sites1, setSites1] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const onSelectSite = value => {
    setSite(value);
    getPos(value);
  }


  
  const addProps = { type: 'pos', onClickAdd, show, onClickDelete };
  const siteProps = { value: site, setValue: onSelectSite, data: sites1, s_value: 'siteId', s_descr: 'name', className: 'r_select' };

  return (
    
  );
}


 */