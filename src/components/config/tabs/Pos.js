import React, { useState } from 'react';

import { ButtonRowAdd, Empty, Error1, Overlay, Table } from '../../all';

export function Pos(props){
  const { active } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const onClickAdd = row => {
    // setVisible(true);
    // setItem(row?.original);
  }

  const emptyProps = { icon: 'MdStayCurrentPortrait', type: 'pos', onClickAdd };
  const addProps = { type: 'pos', onClickAdd };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';

  return (
    <div>
      {/* {visible && <Add {...modalProps} />} */}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length ? <Empty {...emptyProps} /> :
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