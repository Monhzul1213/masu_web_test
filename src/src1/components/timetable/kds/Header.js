import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Tab } from '../kds/Tab'; 
import { DateTime } from '../kds/DateTime';

import { getList } from '../../../../services';
import { DynamicAIIcon, DynamicMDIcon, PlainSelect } from '../../../components/all/all_m';

export function Header({
  setError,
  onSearch,
  size,
  activeTab,
  setActiveTab,
  kdsData
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.login);

  const [sites, setSites] = useState([]);
  const [site, setSite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(null);
  const [classH, setClassH] = useState('th_header_mn1');

  useEffect(() => {
    onFocusSite();
    onFocusCategory();
  }, []);

  useEffect(() => {
    if (size?.width >= 1100) setClassH('th_header_mn1');
    else if (size?.width < 1100 && size?.width >= 760) setClassH('th_header_mn2');
    else setClassH('');
  }, [size?.width]);

  useEffect(() => {
    if (site) handleSearch();
  }, [site, category]);

  const onFocusSite = async () => {
    if (!sites?.length) {
      setError?.(null);
      setLoading('sites');
      const res = await dispatch(getList(user, token, 'Site/GetSite?UseKDS=Y'));
      if (res?.error) setError(res.error);
      else {
        setSites(res.data);
      }
      setLoading(null);
    }
  };

  const onFocusCategory = async () => {
    if (!categories?.length) {
      setError?.(null);
      setLoading('categories');
      const res = await dispatch(getList(user, token, 'Inventory/GetCategory?UseKDS=Y'));
      if (res?.error) setError(res.error);
      else {
        setCategories(res.data);
        setCategory(res.data?.map(item => item.categoryId));
      }
      setLoading(null);
    }
  };

  const handleSearch = () => {
    if (!site) return;
    onSearch?.({
      siteId: site,
      categoryIds: category || []
    });
  };

  const siteProps = {
    value: site,
    setValue: setSite,
    data: sites,
    s_value: 'siteId',
    s_descr: 'name',
    single: true,
    onFocus: onFocusSite,
    loading: loading === 'sites',
    Icon: () => <DynamicAIIcon name="AiOutlineShop" className="mr_cal" />,
    classBack: 'rp_select_back',
    className: 'rp_select',
    dropdownStyle: { marginLeft: -30, minWidth: 180 },
    dropdownAlign: { offset: [-30, 30] },
    placeholder: t('time.select_shop')
  };

  return (
    <div
      className={classH}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--text4-color)',
        width: '100%',
        justifyContent: 'space-between',
        minHeight: 64,
        padding: '0 7px'
      }}
    >
      <div
        className="kds-header-left"
        style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
      >
        <PlainSelect
          {...siteProps}
          data={sites.filter(site => site.useKds === 'Y')}
        />
      </div>

<div
  className="kds-header-center"
  style={{
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 300
  }}
>
  {site && (
    <Tab activeTab={activeTab} setActiveTab={setActiveTab} kdsData={kdsData} />
  )}
</div>

<div
  className="kds-header-right"
  style={{
    minWidth: 300,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }}
>
  {site && <DateTime />}
</div>

    </div>
  );
}
