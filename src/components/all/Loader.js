import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export function Loader(props){
  const { className, color } = props;

  return (
    <div className={className}>
      <ClipLoader color={color ?? '#25a0fe'} size={20} />
    </div>
  )
}