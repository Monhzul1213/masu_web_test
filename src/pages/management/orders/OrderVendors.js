import React, { useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';

import '../../../css/invt.css';
import { Overlay } from '../../../components/all';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    console.log(size);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay className='i_container' loading={loading}>
      OrderVendors
    </Overlay>
  );
}

const withSizeHOC = withSize();
export const OrderVendors = withSizeHOC(Screen);