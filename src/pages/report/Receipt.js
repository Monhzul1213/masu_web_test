import React, { useState } from 'react';
import { withSize } from 'react-sizeme';

import '../../css/invt.css';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Header, Card } from '../../components/report/receipt';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(1);

  const getData = async query => {
    console.log(query);
    setError(null);
    setLoading(false);
    setData(null);
  }

  let headerProps = { onSearch: getData };
  let cardProps = { data, tab, setTab, size };
  let emptyProps = { id: 'rp_empty' };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Header {...headerProps} />
        <Card {...cardProps} />
        <Empty1 {...emptyProps} />
        {/* <List {...cardProps} /> */}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Receipt = withSizeHOC(Screen);