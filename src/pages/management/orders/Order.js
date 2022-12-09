import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useNavigate } from 'react-router-dom';

import '../../../css/order.css';
import { Overlay, Error1, Empty } from '../../../components/all';

export function Order(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    setError(false);
    setFiltering(false);
    setData([]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickAdd = () => navigate && console.log('hey')// navigate('order_vendors');
  
  const emptyProps = { icon: 'MdOutlineArticle', type: 'order', noDescr: true, onClickAdd };
  
  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
              {/* <Header {...headerProps} size={size} /> */}
              {/* {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />} */}
            </div>
          }</SizeMe>
        }
      </Overlay>
    </div>
  );
}