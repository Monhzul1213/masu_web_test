import React, { useState } from 'react';

import '../../../css/order.css';
import { Overlay } from '../../../components/all';

export function Order(){
  const [loading, setLoading] = useState(false);
  
  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>

      </Overlay>
    </div>
  );
}

/**
 * <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
              <Header {...headerProps} size={size} />
              {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
            </div>
          }</SizeMe>
        }
      </Overlay>
    </div>
 */