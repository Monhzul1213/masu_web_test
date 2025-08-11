import React from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import moment from 'moment'

import { DynamicRIIcon } from '../../../all/all_m';
import { formatNumber } from '../../../../../helpers';

export function Image(props) {
    const {color, name, user, category, perc, price, type, categories} = props
    const { t } = useTranslation();

    return (
    <div>
        <div className='image_back' style={{backgroundColor: '#' + color?.value}}></div>
        <div className="cou_circle_back"/>
        <div className="img_line"/>
        <IoIosArrowDroprightCircle name='IoIosArrowDroprightCircle' className="circle1" style={{color: '#' + color?.value}}/>
        <div className='row'>
            <div className='image_name_back'>
                <p className='descr_text'>{user?.msMerchant?.descr}</p>
                <p className='name_text'>{name?.value}</p>
                <p className='gap'/>
            </div>
            <div className='image_price_back'>
                <p className= 'category_text'>{ 
                    categories?.map(item => {
                        if(item?.categoryId === category?.value) return item?.categoryName }
                    )}
                </p>
                <div className={category?.value ? 'price_back' : 'price_back1'}>
                    <p className='text_co' style={{color: '#' + color?.value}}>{t('coupon.coupon')}</p>
                    {type?.value === 0 ? <p className='price_text'>{perc?.value + '% off'}</p> :
                    <p className='price_text'>{formatNumber(price?.value)}<sup>₮</sup></p>}
                </div>
                <div className='date_back'>
                    <DynamicRIIcon name='RiCalendar2Line' style={{color: '#ffffff'}}/>
                    <p className='date_text'>{moment(props?.endDate?.value)?.format('YYYY.MM.DD') + ' хүртэл хүчинтэй'}</p>
                </div>
            </div>
        </div>
    </div>
    )
}
