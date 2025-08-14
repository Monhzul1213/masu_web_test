import React from 'react';
import { Modal } from 'antd';
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from 'html2canvas';

import { Button } from '../../../../components/all';

export function QR(props){
    const { visible, closeModal, qrData } = props;
   
    const downloadQR = () => {
        const element = document.getElementById("qr-container");
        html2canvas(element, { scale: 3 }).then((canvas) => {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "QrMenu.png";
            downloadLink.click();
        });
    };
    
  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={closeModal} centered={true} width={300}>
        <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px 10px'}} id="qr-container">
            <div className='row'>
                <p className='qr_title'>{qrData?.siteName}</p>
                <p className='qr_title' style={{margin: '0 3px'}}>-</p>
                <p className='qr_title'>{qrData?.ticketBinName}</p>
            </div>
            <QRCodeCanvas
                value={qrData?.url}
                size={280}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin={true}
            />
        </div>
        <div style={{paddingBottom: 10}}>
            <Button text={'Татах'} onClick={downloadQR} className='download_btn'/>
        </div>
    </Modal>
  )   
}