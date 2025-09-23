import React from 'react';
import { useTranslation } from 'react-i18next';

function isOrderDone(order) {
  return Array.isArray(order.items) &&
    order.items.length > 0 &&
    order.items.every(item => item.itemStatus === 2);
}

function getHeaderColorClass(order) {
  if (isOrderDone(order)) return 'header-green';
  const startTime = order.createdDate;
  if (!startTime) return 'header-green';
  const created = new Date(startTime);
  const now = new Date();
  const diff = Math.floor((now - created) / 1000);
  const mins = Math.floor(diff / 60);
  if (mins < 10) return 'header-green';
  if (mins < 15) return 'header-orange';
  return 'header-red';
}

function formatTimeDiff(startTime) {
  if (!startTime) return '';
  const created = new Date(startTime);
  const now = new Date();
  let diff = Math.floor((now - created) / 1000);
  if (diff < 0) diff = 0;

  const hh = String(Math.floor(diff / 3600)).padStart(2, '0');
  const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const ss = String(diff % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function List({
  orders,
  onItemStatusChange,
  onOrderStatusChange,
  activeTab,
}) {
  const { t } = useTranslation();

  if (!orders || !orders.length) {
    return <div className="kds-order-list-wrapper">{t('kds.no_order')}</div>;
  }

  const handleItemDoubleClick = (order, item) => {
    if (activeTab === 'doing' && typeof onItemStatusChange === 'function') {
      onItemStatusChange(order, item);
    }
  };

  const handleOrderDoubleClick = (order) => {
    if (typeof onOrderStatusChange === 'function') {
      onOrderStatusChange(order);
    }
  };

  return (
    <div className="kds-order-list-wrapper">
      <div className="kds-order-list-inner">
        {orders.map((order, idx) => {
          const headerClass = getHeaderColorClass(order);
          return (
            <div
              className="kds-card"
              key={order.salesNo || idx}
              onDoubleClick={() => handleOrderDoubleClick(order)}
            >
              <div className={`kds-card-header ${headerClass}`}>
                <span>
                  № {order.refNo ?? String(order.salesNo).slice(-3)} / {order.ticketDescr}
                </span>
                <span>{formatTimeDiff(order.createdDate)}</span>
              </div>
              <div className="kds-card-content">
                <ul className={`kds-item-list ${activeTab === 'ready' ? 'no-hover' : ''}`}>
                  {order.items?.length > 0 ? (
                    order.items.map((item, i) => (
                      <li
                        key={item.lineNbr || item.invtID || i}
                        className={`kds-item-row ${item.itemStatus === 2 ? 'done' : ''}`}
                        onDoubleClick={e => {
                          e.stopPropagation();
                          handleItemDoubleClick(order, item);
                        }}
                      >
                        <span className="qty">{item.qty}</span>
                        <span className="name">{item.invtName}</span>
                      </li>
                    ))
                  ) : (
                    <li className="kds-item-empty">{t('kds.no_order')}</li>
                  )}
                </ul>
                {order.consumerinfo?.[0]?.addDescr && (
                  <div className="kds-adddescr">
                    {order.consumerinfo?.[0]?.phone && (
                      <div>{order.consumerinfo[0].phone}</div>
                    )}
                    <div>{order.consumerinfo[0].addDescr}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
