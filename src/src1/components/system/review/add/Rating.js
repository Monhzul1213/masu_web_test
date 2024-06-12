import React from "react";
import { useTranslation } from 'react-i18next';
import { Rate, Progress } from "antd";
import { formatNumber1 } from "../../../../../helpers";


export function Rating(props){
  const { selected, rate } = props
  const { t } = useTranslation();

  const rate5 = rate?.filter(i => i.rating === 5)[0]?.percentOfAll ?? 0;
  const rate4 = rate?.filter(i => i.rating === 4)[0]?.percentOfAll ?? 0;
  const rate3 = rate?.filter(i => i.rating === 3)[0]?.percentOfAll ?? 0;
  const rate2 = rate?.filter(i => i.rating === 2)[0]?.percentOfAll ?? 0;
  const rate1 = rate?.filter(i => i.rating === 1)[0]?.percentOfAll ?? 0;

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
              </div>
            </div>
            <p className='rating_text'>{(selected?.ratingCount ?? 0 )+ t('rating.rating')}</p>
      </div>
     )
}
            