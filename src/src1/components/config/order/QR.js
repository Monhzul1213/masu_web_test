import React from 'react';
import { Modal } from 'antd';
import { QRCodeCanvas } from "qrcode.react";

import { Button } from '../../../../components/all';

export function QR(props){
    const { visible, closeModal, qrData } = props;
   
    const downloadQR = () => {
        const canvas = document.getElementById("qr-gen");
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "QrMenu.png";
        downloadLink.click();
      };
      
    
  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={closeModal} centered={true} width={300}>
        <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px 10px'}}>
            <p className='qr_title'>{qrData?.ticketBinName}</p>
            <QRCodeCanvas
                id="qr-gen"
                value={qrData?.url}
                size={280}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin={true}
            />
            <Button text={'Татах'} onClick={downloadQR} className='download_btn'/>
        </div>
    </Modal>
  )
}