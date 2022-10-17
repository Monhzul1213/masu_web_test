import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

export function Loading(){
  return (
    <div className='loading'>
      <MoonLoader color='#a020f0' />
    </div>
  )
}