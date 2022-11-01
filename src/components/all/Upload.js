import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { checkMimeType } from '../../helpers';

export function UploadImage(props){
  const { image, setImage, setImageFile } = props;
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
      setImageFile && setImageFile(null);
      setImage(null);
    } else {
      if(info.file.status === 'done'){
        getBase64(info.file.originFileObj, image => {
          setImageFile && setImageFile(info.file.originFileObj);
          setImage(image);
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
      {image ? <img src={image} alt="avatar" className='upload_image' /> : uploadButton}
    </Upload>
  )
}