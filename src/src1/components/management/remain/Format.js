import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../../../css/invt.css';
import { getList } from '../../../../services';
import { excelTypes, ExportExcel3 } from '../../../../helpers';
import { UploadDrag, PlainSelect } from '../../../../components/all';
import { Date } from '../../../components/all/all_m';

export function Format(props){
  const { data, setFile, file, site, setSite, sites, onFormat, date, setDate, setSites } = props
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([])
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.login);

  useEffect(() => {
    onFocusSite()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError && setError(null);
      setLoading('site');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(data);
      }
      setLoading(null);
    }
  }

  useEffect(() => {
    setColumns([
      { Header: t('report.siteCode'), accessor: 'siteId', exLabel:t('remain.siteCode')},
      { Header: t('report.siteName'), accessor: 'siteName', exLabel:t('shop.name')},
      { Header: t('remain.invtCode'), accessor: 'invtId', exLabel:t('remain.invtCode'),  },
      { Header: t('menu.inventory'), accessor: 'name', exLabel:t('menu.inventory'),},
      { Header: t('order.t_stock'), accessor: 'qty', exLabel: t('inventory.t_stock') },
      { Header: t('remain.cost'), accessor: 'cost', exLabel: t('orders.cost')},
      { Header: t('remain.vendCode'), accessor: 'vendId', exLabel: t('remain.vendCode')},
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') },
      { Header: t('inventory.barcode'), accessor: 'barCode', exLabel:t('inventory.barcode') },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onHide = site => {
    let query = '';
    if(site !== -1) (query += '?SiteID=' + site )
    onFormat(query)
  }
  const onHide1 = value => {
    // let query = '?TxnDate=' + date?.format('yyyy.MM.DD');
    // onClickSave(query)
  }

  const onChangeSite = value => {
    setSite(value);
    onHide(value);
  }

  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';

  const uploadProps = { file, setFile, types: excelTypes };
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide: onHide1, className: 'mn_date' };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide, label: t('inventory.t_site'), 
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop'), classBack, classLabel, className, error};

  return (
        <div className='ma_back'>
          <div className='ii_header'>
            <Date {...dateProps} />
            <PlainSelect {...siteProps} />
            <ExportExcel3 text={t('manage.import_link')} columns={columns} excelData={data} fileName={'Baraanii_Uldegdel_Format'} />
          </div>
          <UploadDrag {...uploadProps} />
        </div>
 
  );
}