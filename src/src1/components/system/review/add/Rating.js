import React from "react";
import { useTranslation } from 'react-i18next';
import { Rate, Progress } from "antd";
import { formatNumber1 } from "../../../../../helpers";

// import { Progress } from "./Progress";

export function Rating(props){
  const { selected, rate } = props
  const { t } = useTranslation();

  
  const result = rate?.reduce((obj) => ({...obj}))

  const rate5 = result?.rating === 5 ? result?.percentOfAll : 0
  const rate4 = result?.rating === 4 ? result?.percentOfAll : 0
  const rate3 = result?.rating === 3 ? result?.percentOfAll : 0
  const rate2 = result?.rating === 2 ? result?.percentOfAll : 0
  const rate1 = result?.rating === 1 ? result?.percentOfAll : 0
  const rate0 = result?.rating === 0 ? result?.percentOfAll : 0

     return (
      <div className="rating_back_1">
            <div className="rating_back" >
              <p className="rating_average">{formatNumber1(selected?.avgRating) }</p>
              <div className='rating_star_row'>
                <div className='rating_progress'>
                  <Rate defaultValue={0} style={{fontSize: 8}} disabled/>
                  <Progress percent = {rate5} style={{width: 200}} showInfo={false}  />
                </div>
                <div className='rating_progress'>
                  <Rate count={4} style={{fontSize: 8}} defaultValue={0} disabled/>
                  <Progress percent = {rate4} style={{width: 200}} showInfo={false}  />
                </div>
                <div className='rating_progress'>
                  <Rate count={3} style={{fontSize: 8}} defaultValue={0} disabled/>
                  <Progress percent = {rate3} style={{width: 200}} showInfo={false}  />
                </div>
                <div className='rating_progress'>
                  <Rate count={2} style={{fontSize: 8}} defaultValue={0} disabled/>
                  <Progress percent = {rate2} style={{width: 200}} showInfo={false}  />
                </div>
                <div className='rating_progress'>
                  <Rate count={1} style={{fontSize: 8}} defaultValue={0} disabled/>
                  <Progress percent = {rate1} style={{width: 200}} showInfo={false}  />
                </div>
                <div className='rating_progress'>
                  <Rate count={1} style={{fontSize: 8}} defaultValue={0} disabled/>
                  <Progress percent = {rate0} style={{width: 200}} showInfo={false}  />
                </div>
              </div>
            </div>
            <p className='rating_text'>{selected?.ratingCount + t('rating.rating')}</p>
      </div>
     )
}
            