import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { checkMimeType } from '../../helpers';

export function UploadImage(props){
  const { image, setImage, setImage64, setImageType, setEdited } = props;
  const [loading, setLoading] = useState(false);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = info => {
    if(info.file.status === 'uploading'){
      setLoading(true);
      return;
    }
    const error = checkMimeType(info.file);
    if(error){
      message.error(error, 10);
      setLoading(false);
      setImage64(null);
      setImage(null);
      setImageType(null);
    } else {
      if(info.file.status === 'done'){
        getBase64(info.file.originFileObj, image => {
          setImage(info.file.originFileObj);
          setImage64(image);
          setEdited && setEdited(true);
          setImageType(info.file.originFileObj?.type?.replace(/(.*)\//g, ''));
          setLoading(false);
        });
      }
    }
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 0);
  };

  const uploadButton = (
    <div className='upload_btn'>
      {loading ? <LoadingOutlined className='upload_icon' /> : <PlusOutlined className='upload_icon' />}
      <p className='upload_text'>Upload</p>
    </div>
  );

  return (
    <Upload
      name='avatar'
      className='u_image'
      listType='picture-card'
      showUploadList={false}
      customRequest={dummyRequest}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={handleChange}>
      {image ? <img src={URL.createObjectURL(image)} alt="avatar" className='upload_image' /> : uploadButton}
    </Upload>
  )
}