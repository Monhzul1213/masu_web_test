import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../services';
import { ButtonRowAdd, Empty, Error1, Overlay } from '../../all';
import { Add } from './pos1';

export function Pos(props){
  const { active, setActive } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [shops, setShops] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(active === 'pos') getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const getData = async () => {
    let pos = await getPos();
    // if(pos && !pos?.length) await getSites();
    if(!pos?.length) await getSites();
  }

  const getSites = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    console.log(response);
    setLoading(false);
    if(response?.error) {
      setError(response?.error);
      return false;
    }
    else {
      setShops(response?.data);
      return response?.data;
    }
  }

  const getPos = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetPos'));
    console.log(response);
    setLoading(false);
    if(response?.error) {
      setError(response?.error);
      return false;
    }
    else {
      setData(response?.data);
      return response?.data;
    }
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const onClickShop = () => setActive(['store']);

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getPos();
  }

  const emptyProps = { icon: 'MdStayCurrentPortrait', type: 'pos', onClickAdd };
  const empty1Props = { icon: 'MdStayCurrentPortrait', type: 'pos1', onClickAdd: onClickShop };
  const addProps = { type: 'pos', onClickAdd };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const modalProps = { visible, closeModal, selected: item };

  return (
    <div>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length ? !shops?.length ? <Empty {...empty1Props} /> : <Empty {...emptyProps} /> :
          <div className='card_container'>
            <ButtonRowAdd {...addProps} />
            <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
              {/* <Table {...tableProps} /> */}
            </div>
            {/* <PaginationTable {...tableProps} /> */}
          </div>
        }
      </Overlay>
    </div>
  )
}