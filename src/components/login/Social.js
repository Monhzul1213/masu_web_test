import React from 'react';
import { GrFacebookOption } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from '../all';

export function Social(){
  const { t } = useTranslation();

  return (
    <div>
      <div className='social_header'>
        <div className='social_line' />
        <p className='social_label'>{t('login.visit')}</p>
        <div className='social_line' />
      </div>
      <div className='social_row'>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://www.facebook.com/masupos'>
          <GrFacebookOption className='social' style={{fontSize: 22, color: '#4267B2'}} />
        </a>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://twitter.com/masupos'>
          <DynamicAIIcon name='AiOutlineTwitter' className='social' style={{color: '#1DA1F2'}} />
        </a>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://www.youtube.com/channel/UCYbdLbekzT4LpM37KLRO0yg'>
          <DynamicAIIcon name='AiFillYoutube' className='social' style={{color: '#FF0000'}} />
        </a>
      </div>
    </div>
  )
}