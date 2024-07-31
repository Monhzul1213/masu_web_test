import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import { getList } from '../../services';
import { ButtonRowAdd, Empty, Error1, Overlay } from '../../components/all';
import { List } from '../../components/config/tax/list';

function Card(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/VatRequest/GetVatRequest?ReqeustId=-2'));
    if(response?.error) setError(response?.error);
    else setData(response?.data?.vatrequest);
    setLoading(false);
  }

  const onClickAdd = row => {
    if(row) navigate({ pathname: 'tax_add', search: createSearchParams({ requestId: row?.original?.requestId }).toString() });
    else navigate('tax_add');
  }

  const width = size?.width >= 780 ? 780 : size?.width;
  const emptyProps = { icon: 'MdOutlineReceipt', type: 'tax', noDescr: true, onClickAdd };
  const addProps = { type: 'tax', onClickAdd };
  const listProps = { data, onClickAdd };

  return (
    <div className='store_tab' style={{flex: 1}}>
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
export const Tax = withSizeHOC(Card);