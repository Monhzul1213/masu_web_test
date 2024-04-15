import React from 'react';

export function TabType(props){
  const { page } = props;

  return page === 1 && (
    <div>
      TabType
    </div>
  );
}