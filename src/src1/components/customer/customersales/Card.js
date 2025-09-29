import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../css/report.css';
import { DynamicTBIcon, Money } from '../../all/all_m';

export function Card({ size, total }) {
  useTranslation();

  const id = size?.width >= 720 ? 'rp_card_large' : 'rp_card_small';
  const maxWidth =
    size?.width >= 1260 ? 300 :
    size?.width >= 720  ? Math.floor((size?.width - 80) / 3) :
                          (size?.width - 45);

  const Box = ({ label, value, count, icon, color }) => (
    <div className="rp_card_btn" style={{ maxWidth, width: maxWidth }}>
      <div className="rp_card_header">
        <p className="rp_card_label">{label}</p>
        <DynamicTBIcon name={icon} className="rp_card_icon_z" style={{ color }} />
      </div>
      <div className="rp_card_side">
        <p className="rp_card_value">
          <Money value={value || 0} fontSize={size?.width >= 720 ? 20 : 16} />
        </p>
        {count !== undefined && (
          <p className="rp_card_value1" style={{ color: '#969696' }} align="center">
            {count ?? 0}
          </p>
        )}
      </div>
    </div>
  );

  const salesAmt  = Number(total?.salesAmt)  || 0;
  const returnAmt = Math.abs(Number(total?.returnAmt) || 0);
  const netProfit = salesAmt - returnAmt;

  const salesVat  = Number(total?.salesVat)  || 0;
const returnVat = Number(total?.returnVat) || 0;

  return (
    <div className="rp_card" id={id}>
      <div className="rp_card_row">
        <Box
          label="Нийт борлуулалт"
          icon="TbReceipt"
          color="#017EBE"
          value={salesAmt}
          count={salesVat}
        />
        <div className="rp_card_line" />
        <Box
          label="Нийт буцаалт"
          icon="TbReceipt2"
          color="#F59E0B"
          value={returnAmt}
          count={returnVat}
        />
        <div className="rp_card_line" />
        <Box
          label="Цэвэр ашиг"
          icon="TbReceiptRefund"
          color="#10B981"
          value={netProfit}
        />
      </div>
    </div>
  );
}