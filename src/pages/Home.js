import React from 'react';

import { logo } from '../assets';

export function Home(){
  return (
    <div style={{padding:15, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <img src={logo} className='home_logo' alt='LOGO' />
    </div>
  )
}