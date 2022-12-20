import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import { getList } from '../../services';
import { ButtonRowAdd, Empty, Error1, Overlay } from '../../components/all';

function Card(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const onClickAdd = row => navigate('tax_add');

  const width = size?.width >= 720 ? 720 : size?.width;
  const emptyProps = { icon: 'MdOutlineReceipt', type: 'tax', noDescr: true, onClickAdd };
  const addProps = { type: 'shop', onClickAdd };

  return (
    <div className='store_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length ? <div style={{ width }}><Empty {...emptyProps} /></div> :
          <div className='mo_container' style={{ width }}>
            <ButtonRowAdd {...addProps} />
            {/* <List {...listProps} /> */}
          </div>
        }
      </Overlay>
    </div>
  );
}
/*
function Card(props){
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
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
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
  }

  const emptyProps = { icon: 'MdStorefront', type: 'shop', noDescr: true, onClickAdd };
  const modalProps = { visible, closeModal, selected: item };
  const listProps = { data, onClickAdd };

  return (
    
  );
}
*/
const withSizeHOC = withSize();
export const Tax = withSizeHOC(Card);