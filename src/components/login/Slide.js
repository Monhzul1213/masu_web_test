import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

export function Slide(props){
  const { ads } = props;

  const renderItem = (item, index) => {
    let type = item?.file?.fileType?.replace('.', '');
    let src = `data:image/${type};base64,${item?.file?.fileData}`
    return (
      <SwiperSlide key={index} style={{
        display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
        // backgroundColor: 'red',
        // height: '100vh'
        }}>
        <img src={src} alt={item?.adsName}  style={{
          maxHeight: '100vh',
          maxWidth: 'calc(100vw - 460px)',
          objectFit: 'contain'
        }} />
      </SwiperSlide>
    );
  }

  return (
    <div style={{
      height: '100vh',
      maxWidth: 'calc(100vw - 460px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        style={{
          backgroundColor: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center'
        }}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}>
        {ads?.map(renderItem)}
      </Swiper>
    </div>
  );
}