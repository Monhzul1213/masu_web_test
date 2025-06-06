import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import mime from 'mime';

import '../../../../css/order.css';
import { placeholder } from '../../../../assets';
import { urlToFile } from '../../../../helpers';

function Item(props){
  const { item, width, onClick } = props;
  const [image, setImage] = useState(null);

  useEffect(() => {
    getImage();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImage = async () => {
    if(item?.fileraw?.fileData){
      let type = item?.fileraw?.fileType?.replace('.', '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${item?.fileraw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage(attachFile);
    }
  }

  let style = { maxWidth: width - 30, objectFit: 'cover' };

  return (
    <button className='po_vend_btn' style={{ width }} onClick={() => onClick(item)}>
      {image
        ? <img src={URL.createObjectURL(image)} className='po_vend_logo' alt={item?.vendName} style={style} />
        : <img src={placeholder} className='po_vend_place' alt={item?.vendName} />}
      <p className='po_vend_title'>{item?.vendName}</p>
    </button>
  )
}

export function Vendors(props){
  const { size, data } = props;
  const [width, setWidth] = useState(300);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(size?.width >= 1275) setWidth(300);
    else if(size?.width >= 1050 && size?.width < 1275) setWidth(Math.floor((size?.width - 75) / 4));
    else if(size?.width >= 795 && size?.width < 1050) setWidth(Math.floor((size?.width - 60) / 3));
    else setWidth(Math.floor((size?.width - 45) / 2));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onClick = item => {
    let pathname = searchParams?.get('next');
    navigate({ pathname, search: createSearchParams({ vendId: item?.vendId }).toString() });
  }

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, width, onClick };
    return (<Item {...itemProps} />);
  }

  return (
    <div className='po_vend_back'>
      {data?.map(renderItem)}
    </div>
  )
}