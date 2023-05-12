import React from 'react';
import { Image } from 'antd';
import { MdOutlineImageNotSupported } from 'react-icons/md'

export function UploadImage(props){
  const { image, size } = props;

  const id = size?.width > 870 ? 'ih_large' : 'ih_small';

  return (
    <div className='upload_back' id={id} >
    {image ? <Image
      width={100}
      src={URL.createObjectURL(image)} alt="avatar" 
      className='image_z'  /> 
      : <MdOutlineImageNotSupported className='upload_icon_z' />}
    </div>
      
  )
}