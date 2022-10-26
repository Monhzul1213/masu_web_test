import React from 'react';

export function Item(props){
  const { item } = props;

  return (
    <div>
      {item?.categoryName}
    </div>
  )
}