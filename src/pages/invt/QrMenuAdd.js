import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getList, sendRequest } from '../../services';
import { Overlay, Prompt, Error1, ButtonRow } from '../../components/all';
import { Main, CardSite, List } from '../../components/invt/QrMenu/add';

export function QrMenuAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user, token } = useSelector((state) => state.login);
  const maxWidth = useSelector((state) => state.temp.maxWidth);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [status, setStatus] = useState({ value: 1 });
  const [header, setHeader] = useState(null);
  const [site, setSite] = useState([]);
  const [checked, setChecked] = useState(true);
  const [detail, setDetail] = useState([]);
  const [dItems, setDItems] = useState([]);
  const [search, setSearch] = useState({ value: '' });
  const [selectedSite, setSelectedSite] = useState(null);

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  };

  const onError = (err) => {
    setError(err);
    setEdited(true);
    setLoading(false);
  };

  const onSuccess = (msg) => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.msRole?.webManageItem !== 'Y') return navigate('/');
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (saved) onClickCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  const loadData = async () => {
    let qrMenuId = searchParams?.get('qrMenuId');

    const siteRes = await dispatch(getList(user, token, 'Site/GetSite'));
    const allSites = siteRes?.data?.map((s) => ({ ...s, checked: true })) || [];

    if (!qrMenuId) {
      setSite(allSites);
      return;
    }

    const res = await dispatch(getList(user, token, `Integration/GetQrMenu?menuId=${qrMenuId}`));
    if (res?.error) return setError(res.error);

    const d = res.data?.menu?.[0];
    setHeader(d);
    setName({ value: d?.descr });
    setBeginDate({ value: moment(d?.beginDate, 'YYYY.MM.DD') });
    setEndDate({ value: moment(d?.endDate, 'YYYY.MM.DD') });
    setStatus({ value: d.status ?? 1 });

    const loadedItems = (res.data?.menuitem || []).map((item) => ({
      ...item,
      rowStatus: 'U',
      name: item?.invtName,
      status: item?.status ?? 1,
      statusName: item?.status === 1 ? 'Идэвхтэй' : 'Идэвхгүй',
    }));
    setDetail(loadedItems);

    const selectedSiteIds = (res.data?.menusite || []).map((s) => s.siteId);

    const mergedSites =
      selectedSiteIds.length > 0
        ? allSites.map((site) => ({
            ...site,
            checked: selectedSiteIds.includes(site.siteId),
            qrMenuId: selectedSiteIds.includes(site.siteId) ? true : null,
          }))
        : allSites.map((site) => ({
            ...site,
            checked: false,
          }));

    const isAllSelected =
      selectedSiteIds.length === allSites.length &&
      allSites.every((site) => selectedSiteIds.includes(site.siteId));

    setChecked(isAllSelected);
    setSite(mergedSites);
  };

  const validate = () => {
    const length = detail?.length;

    if (name?.value && length) {
      const sites = [],
        items = [];

      site.forEach((s) => {
        const wasChecked = !!s.qrMenuId;
        const isChecked = s.checked;

        if (isChecked && !wasChecked) {
          sites.push({ siteId: s.siteId, rowStatus: 'I' });
        } else if (!isChecked && wasChecked) {
          sites.push({ siteId: s.siteId, rowStatus: 'D' });
        } else if (isChecked && wasChecked) {
          sites.push({ siteId: s.siteId, rowStatus: 'U' });
        }
      });

      detail.forEach((item) => {
        const isNew = !item.qrMenuItemId;
        if (isNew && !item.invtId) return;

        const rowStatus = isNew ? 'I' : 'U';

        items.push({
          ...item,
          rowStatus,
          invtId: item?.invtId,
          status: item?.status ?? 1,
          price: item?.price ?? 0, 
        });
      });

      return {
        qrMenuId: header?.qrMenuId ?? -1,
        descr: name?.value,
        beginDate: beginDate?.value?.format('YYYY.MM.DD'),
        endDate: endDate?.value?.format('YYYY.MM.DD'),
        status: status?.value,
        rowStatus: header?.qrMenuId ? 'U' : 'I',
        sites,
        items,
      };
    } else {
      if (!name?.value) setName({ value: '', error: t('error.not_empty') });
      if (!length) setSearch({ value: '', error: t('adjust.items_error') });
      return false;
    }
  };

  const onClickCancel = () => navigate('/qrmenu/qrmenu');

  const onClickSave = async () => {
    const body = validate();
    if (!body) return;

    onLoad(); 
    const res = await dispatch(sendRequest(user, token, 'Integration/ModQrMenu', body));

    if (res?.error) onError(res.error);
    else onSuccess(t('adjust.add_success'));
  };

  return (
    <div className="s_container_i" style={{ maxWidth }}>
      <Overlay loading={loading}>
        <Prompt edited={edited} />
        {error && <Error1 error={error} />}
        <form className="i_scroll">
          <Main
            name={name}
            setName={setName}
            beginDate={beginDate}
            setBeginDate={setBeginDate}
            endDate={endDate}
            setEndDate={setEndDate}
            status={status}
            setStatus={setStatus}
          />

          <CardSite
            data={site}
            setData={setSite}
            setEdited={setEdited}
            checked={checked}
            setChecked={setChecked}
          />
          <div className="gap" />
          <div className="po_back" id="po_back_invt5">
           <List
              detail={detail}
              setDetail={setDetail}
              dItems={dItems}
              setDItems={setDItems}
              search={search}
              setSearch={setSearch}
              siteId={selectedSite?.siteId}
              editable
              setEdited={setEdited}
            />
            </div>
        </form>
        <ButtonRow
          onClickCancel={onClickCancel}
          onClickSave={onClickSave}
          header={header}
          id="qr_menu_add"
        />
      </Overlay>
    </div>
  );
}
