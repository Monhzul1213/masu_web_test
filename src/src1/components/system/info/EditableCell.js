// import React, { useState } from 'react';
// import { DynamicAIIcon } from '../../all/all_m';

// export const EditableCell = props => {
//   const {row, classShow } = props;
//   const [visible, setVisible] = useState(false);
  
//   const onClick = () => {
//     setVisible(false);
//   };

//   const onClick1 = () => {
//     setVisible(true);
//   };

//   const inputProps = { className: 'ed_input1', value: row?.original?.user1, id: visible ? null : 'm_input_password' , disabled: true, style: {width: 150}};

//   return (
//     <div className='row'>
//         <input {...inputProps} />
//         <DynamicAIIcon size={18} className={classShow ?? 'ed_show_eye'} name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={visible ? onClick : onClick1} />
//     </div>
//   )
// }