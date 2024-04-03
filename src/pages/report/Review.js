import React from 'react';
import { withSize } from 'react-sizeme';

import '../../css/report.css';
import { Review1 } from '../../components/report/review';

function Screen(props){

  return (
    <div className='s_container'>
        <Review1/>
    </div>
  )
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);