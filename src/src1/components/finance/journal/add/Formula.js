import React from "react";
import { Modal } from "antd";
import { formula } from "../../../../../assets";


export function Formula(props) {
  const { visible, closeModal } = props;

  return (
    <Modal title={null} footer={null} closable={true} onCancel={closeModal} open={visible} centered={true} width={650}>
        <div style={{padding: '15px 10px'}}>
            <p style={{fontSize: 12, fontWeight: 500}}>Томьёо тайлбар</p>
            <div style={{margin: 0}}>
                <p style={{fontSize: 10, margin: '0 10px'}}>NULL: Нийт дүн</p>
                <p style={{fontSize: 10, margin: '0 10px'}}>A1: Эхний мөр</p>
                <p style={{fontSize: 10, margin: '0 10px'}}>A2: Хоёрдахь мөр</p>
            </div>
            <img src={formula} style={{width: 620}}/>
        </div>
    </Modal>
  );    
}
