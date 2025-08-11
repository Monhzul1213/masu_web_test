import React from 'react';

import { DynamicAIIcon } from './DynamicIcon';

export function Sort(props){
  const { data } = props;

  return (
    <div className='table_sort'>
      <DynamicAIIcon name='AiFillCaretUp' className={data?.isSorted && !data?.isSortedDesc ? 'table_sort_icon_selected' : 'table_sort_icon'} />
      <DynamicAIIcon name='AiFillCaretDown' className={data?.isSortedDesc ? 'table_sort_icon_selected' : 'table_sort_icon'} />
    </div>
  )
}