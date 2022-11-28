import React, { useState } from 'react';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { Header } from '../../components/report/receipt';

export function Receipt(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = async query => {
    console.log(query);
    setError(null);
    setLoading(false);
  }

  let headerProps = { onSearch: getData };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Header {...headerProps} />
      </Overlay>
    </div>
  );
}