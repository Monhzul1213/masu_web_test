import React from 'react';

import { Empty } from '../../all';

export function Document(){
  
  const emptyProps = { icon: 'MdOutlineReceiptLong', type: 'document', noDescr: true };//onClickAdd

  return (
    <div>
      <Empty {...emptyProps} />
      {/* <Overlay loading={loading}> */}
        {/* {error && <Error1 error={error} />}
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='card_container'>
            <ButtonRowAdd {...addProps} />
            <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
              <Table {...tableProps} />
            </div>
            <PaginationTable {...tableProps} />
          </div>
        } */}
      {/* </Overlay> */}
    </div>
  )
}