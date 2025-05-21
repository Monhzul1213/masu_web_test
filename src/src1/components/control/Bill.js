import React from 'react';

import '../../../css/bill.css';
import { DynamicBSIcon, Error1, Overlay } from '../../../components/all';
import { Info, Header, Items, Total, QR } from './billComp';

export function Bill(props){
  const {header, footer, site, isPrint, image64, loading , error, size } = props

  let data = [{
    price: '15000',
    amount: '30000',
    barCode: '12345678',
    qty: '2',
    invtId: '123',
    invtName: 'Pepsi том'
  },
  {
    price: '10000',
    amount: '100000',
    barCode: '000000123',
    qty: '10',
    invtId: '12',
    invtName: 'Fanta жижиг'
  }
  ];

  const infoProps = {header, site, image64};

  return (
    <Overlay loading={loading}>
      <div className='bl_back' id='bill_back1' style={{backgroundColor: '#f2f2f2', marginTop: size?.width > 700 ? 0 : 20}}>
        {error && <Error1 error={error} />}
        {!header ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            <Info {...infoProps}/>
            <Header />
            <Items detail ={data} showBarCode ={isPrint}/>
            <Total  />
            <QR/>
            <p className='bl_footer' style={{fontSize: 12, marginTop: '5px', whiteSpace: 'pre-line'}}>{footer?.value?.replace(/↵/g, '\n')}</p>
          </div>
        }
      </div>
    </Overlay>
  )
}