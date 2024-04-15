import React from 'react';

export function TabGive(props){
  const { page } = props;

  return page === 2 && (
    <div>
      TabGive
    </div>
  );
}