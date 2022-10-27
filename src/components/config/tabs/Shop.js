import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Empty } from '../../all';
import { Add } from './store';

export function Shop(){
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  /**
   *  "merchantID": 0,
  "name": "string",
  "address": "string",
  "phone": "string",
  "descr": "string"
   */
  
  const onClickAdd = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const emptyProps = { icon: 'MdStorefront', type: 'shop', noDescr: true, onClickAdd };
  const addProps = { visible, closeModal };

  return (
    <div>
      {visible && <Add {...addProps} />}
      {!data?.lenght ? <Empty {...emptyProps} /> :
        <div>
          List
        </div>
      }
    </div>
  );
}