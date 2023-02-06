import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { BiImport } from 'react-icons/bi';

import { checkMimeType } from '../../helpers';
const { Dragger } = Upload;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function UploadImage(props){
  const { image, setImage, setImage64, setImageType, setEdited, className } = props;
  const [loading, setLoading] = useState(false);

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
          let type = info.file.originFileObj?.type?.replace(/(.*)\//g, '');
          setImageType(type);
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
      className={className ?? 'u_image'}
      listType='picture-card'
      showUploadList={false}
      customRequest={dummyRequest}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={handleChange}>
      {image ? <img src={URL.createObjectURL(image)} alt="avatar" className='upload_image' /> : uploadButton}
    </Upload>
  )
}

export function UploadFile(props){
  const { value, onUpload, types } = props;

  const onChangeHandler = event => {
    const error = checkMimeType(event.target.files[0], types);
    if(error){
      message.error(error);
      document.getElementById('u_file').value = "";
    } else {
      getBase64(event.target.files[0], str64 => {
        let name = event.target.files[0]?.name;
        // let type = event.target.files[0]?.type?.replace(/(.*)\//g, '');
        let type = name;//?.split('.')?.pop();
        onUpload({ name, str64, type });
      });
    }
  }

  return (
    <div className='u_file_btn'>
      <label>
        <input id='u_file' type="file" name="file" onChange={onChangeHandler}/>
        {value
          ? <span className='u_file_name'>{value}</span>
          : <span className='u_file_place'>Upload</span>
        }
      </label>
    </div>
  );
}

export function UploadDrag(props){
  const { file, setFile } = props;
  const [loading, setLoading] = useState(false);

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 0);
  };

  const onChange = info => {
    if(info.file.status === 'uploading'){
      setLoading(true);
      return;
    }
    const error = null; checkMimeType(info.file);
    if(error){
      message.error(error, 10);
      setLoading(false);
      setFile(null);
    } else {
      if(info.file.status === 'done'){
        getBase64(info.file.originFileObj, base64 => {
          setFile({
            object: info.file.originFileObj,
            base64,
            type: info.file.originFileObj?.type?.replace(/(.*)\//g, ''),//or just name??
            name: info.file.originFileObj?.name
          });
          setLoading(false);
        });
      }
    }
  }

  return (
    <Dragger
      name='file'
      className='upload_drag'
      multiple={false}
      maxCount={1}
      action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
      customRequest={dummyRequest}
      onChange={onChange}>
      <div className='drag_back'>
        {loading ? <LoadingOutlined className='drag_icon' /> : <BiImport className='drag_icon' />}
        <p className='drag_text'>{file?.name ?? 'Upload'}</p>
      </div>
    </Dragger>
  );
}