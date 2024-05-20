import React, { useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';

function Screen(props){


    return (
    <div className='s_container_r'>

    </div>
  );
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);