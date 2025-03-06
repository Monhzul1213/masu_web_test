// import React, { useState } from "react";

// import { DynamicMDIcon } from "../../../all";
// import { info, youtube } from "../../../../assets";
// import { Play } from "./Play";

// export function Help(props){
//     const {open, setOpen } = props;
//     const [visible, setVisible] = useState(false);

//     const onClick = () => {
//         setVisible(true)
//     }

//     const onClickDrawer = () => {
//         setOpen(true)
//     }

//     const onCancel = () => {
//         setVisible(false)
//     }

//     const playProps = {visible, onCancel}
//     return (
//     <div>
//         <Play {...playProps}/>
//         {<div className='youtube_drawer' onClick={onClickDrawer}>
//             <DynamicMDIcon name='MdOutlineChevronLeft' className='youtube_drawer_icon'/>
//         </div>}
//         {open && <div className="help_back">
//             <div className="help_header">
//                 <img src={youtube} alt="video" className="you_icon"/>
//                 <p className="you_text">Видео заавар</p>
//             </div>
//             <div className="help_body">
//                 <div style={{display: "flex", flexFlow: 'row'}}>
//                     <img src={info} alt="video" className="you_icon1"/>
//                     <p className="you_text1">Хэрхэн бараа нэмэх вэ?</p>
//                 </div>
//                 <DynamicMDIcon name='MdOutlinePlayCircleFilled' className='you_icon2' onClick={onClick}/>
//             </div>
//         </div>}
//     </div>
//     )
// }

// import React, { useState } from "react";

// import { Modal } from "antd";
// import LiteYouTubeEmbed from "react-lite-youtube-embed";
// import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
// import { useTranslation } from "react-i18next";

// export function Play(props){
//     const {visible, onCancel} = props;
//     const { t } = useTranslation();

//     return (
//     <Modal title={null} footer={null} closable={true} open={visible} centered={true} width={800} onCancel={onCancel} key={visible}>
//         <div className='m_back'>
//           <div className='app_scroll'>
//             <p className='ap_text'>{t('config.watch_video')}</p>
//             <LiteYouTubeEmbed id={ "8IMwbPxh-QQ"} title="What’s new in Material Design for the web (Chrome Dev Summit 2019)" />
//           </div>
//         </div>
//       </Modal>
//     )
// }

import React, { useState } from "react";

import { motion } from "framer-motion";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

import { DynamicAIIcon } from "../../../all";

export function Help(props){
    const {videoData} = props;
    const [open, setOpen] = useState(false);

    const renderItem = item => {
      return (
        <div className="help_body">
          <LiteYouTubeEmbed id={item?.id} />
        </div>
        );
    }
    
    return (
      <div style={{display: "flex", justifyContent: "center", right: 0, top: videoData?.length === 1 ? '40%' : videoData?.length === 2 ? '30%' : '20%', position:"absolute" }}>
        {open && <motion.div id='table_scroll1' className="youtube_drawer" style={{height: videoData?.length === 1 ? 200 : videoData?.length === 2 ? 350 : 500}} initial={{ x: 300 }} animate={{ x: open ? 0 : 300 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              {videoData?.map(renderItem)}
        </motion.div>}
        <motion.div className="youtube_drawer_toggle" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)} style={{ right: open ? 300 : 0, top: videoData?.length === 1 ? 80 : videoData?.length === 2 ? 150 : 220 }}>
          <DynamicAIIcon name='AiFillYoutube' className="you_icon" style={{color: 'red'}}/>
        </motion.div>
      </div>
    );
  };