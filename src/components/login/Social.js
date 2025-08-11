import React from 'react';
import { GrFacebookOption } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from '../all';
import { twitter, twitter2 } from '../../assets';

export function Social(){
  const { t } = useTranslation();

  return (
    <div className='social_back1'>
      <div className='social_header'>
        <div className='social_line' />
        <p className='social_label'>{t('login.visit')}</p>
        <div className='social_line' />
      </div>
      <div className='social_row'>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://www.facebook.com/masupos'>
          <GrFacebookOption className='social' style={{fontSize: 22, color: '#111111'}} />
        </a>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://twitter.com/masupos'>
          {/* <DynamicAIIcon name='AiOutlineTwitter' className='social' style={{color: '#111111'}} /> */}
          <img style={{color: '#111111', width: 17}} src={twitter} alt='Twitter'/>
        </a>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://www.instagram.com/app.masu.mn/'>
          <DynamicAIIcon name='AiFillInstagram' className='social' style={{color: '#111111'}} />
        </a>
        <a className='social_link' target='_blank' rel='noreferrer' href='https://www.youtube.com/channel/UCYbdLbekzT4LpM37KLRO0yg'>
          <DynamicAIIcon name='AiFillYoutube' className='social' style={{color: '#111111'}} />
        </a>
      </div>
    </div>
  )
}

export function Social1(){
  // const { t } = useTranslation();

  return (
    <div className='lg_social_back'>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://www.facebook.com/masupos'>
        <GrFacebookOption className='lg_social' style={{fontSize: 20}} />
      </a>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://twitter.com/masupos'>
        <img style={{width: 16}} src={twitter2} alt='Twitter'/>
      </a>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://www.instagram.com/app.masu.mn/'>
        <DynamicAIIcon name='AiFillInstagram' className='lg_social' />
      </a>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://www.youtube.com/channel/UCYbdLbekzT4LpM37KLRO0yg'>
        <DynamicAIIcon name='AiFillYoutube' className='lg_social' />
      </a>
    </div>
  );
}