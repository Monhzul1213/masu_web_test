import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getList } from '../../services';
import { ButtonRowAdd, Empty, Error1, Overlay } from '../../components/all';
import { Add, List } from '../../components/config/store';

function Card(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
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
    else {
      response?.data?.forEach(item => {
        let address = [];
        if(item?.descr) address.push(item?.descr);
        if(item?.subDescr) address.push(item?.subDescr);
        if(item?.address) address.push(item?.address);
        item.address_text = address?.join(', ');
      })
      setData(response?.data);
    }
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

  const width = size?.width >= 840 ? 840 : size?.width;
  const emptyProps = { icon: 'MdStorefront', type: 'shop', noDescr: true, onClickAdd };
  const modalProps = { visible, closeModal, selected: item, setData };
  const addProps = { type: 'shop', onClickAdd };
  const listProps = { data, onClickAdd, getData };

  return (
    <div className='store_tab' style={{flex: 1}}>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length ? <div style={{ width }}><Empty {...emptyProps} /></div> :
          <div className='mo_container' style={{ width }}>
            <ButtonRowAdd {...addProps} />
            <List {...listProps} />
          </div>
        }
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Store = withSizeHOC(Card);