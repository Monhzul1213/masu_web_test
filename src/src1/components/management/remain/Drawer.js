import React, { useEffect, useState } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import mime from 'mime';

import '../../../css/report.css';
import { sendRequest } from '../../../../services';
import { urlToFile } from '../../../../helpers';
import { DynamicAIIcon, Error1, Overlay } from '../../../../components/all';

export function Drawer(props){
  const { selected, open, setOpen } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected) getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const getData = async () => {
    setLoading(true);
    setError(null);
    let data = [{ fieldName: 'InvtID', value: selected?.invtID ?? selected?.invtId }]
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    if(response?.error){
      setError(response?.error);
      setImage(null);
    } else {
      let invt = response && response?.data && response?.data[0];
      if(invt?.msInventory?.fileRaw?.fileData){
        let type = invt?.msInventory?.fileRaw?.fileType?.replace('.', '');
        let mimeType = mime.getType(type);
        let dataPrefix = `data:` + mimeType + `;base64,`;
        let attach64 = `${dataPrefix}${invt?.msInventory?.fileRaw?.fileData}`;
        let attachFile = await urlToFile(attach64, mimeType);
        setImage(attachFile);
      } else
        setImage(null);
    }
    setLoading(false);
  }
  
  const onClose = () => setOpen(null);
  const drawerProps = { className: 'rp_drawer', placement: 'right', onClose, closable: false, open, mask: false };
  
  return (
    <AntDrawer {...drawerProps}>
      <Overlay loading={loading}>
        <div className='dr_back'>
          <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
          <p className='dr_title'>{selected?.invtName}</p>
          {image
            ? <img src={URL.createObjectURL(image)} alt="avatar" className='dr_image' />
            : <div className='dr_image_holder'><p className='dr_image_text'>No image</p></div>}
          {error && <Error1 error={error} />}
        </div>
      </Overlay>
    </AntDrawer>
  );
}