import React from 'react';
import * as Icons from 'react-icons/md';
import * as AIIcons from 'react-icons/ai';

export const DynamicMDIcon = props => {
  const IconComponent = Icons[props?.name];

  if(!IconComponent){ return <Icons.MdHomeFilled {...props} />; }
  return <IconComponent {...props} />;
};

export const DynamicAIIcon = props => {
  const IconComponent = AIIcons[props?.name];

  if(!IconComponent){ return <AIIcons.AiFillHome {...props} />; }
  return <IconComponent {...props} />;
};