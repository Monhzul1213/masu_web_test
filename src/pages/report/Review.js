import React from 'react';
import { withSize } from 'react-sizeme';

import '../../css/invt.css';
import '../../css/report.css';
import { Filter } from '../../components/report/review/Filter';

function Screen(props){

  return (
    <div className='s_container_r'>
        <Filter  />
    </div>
  )
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);