import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DynamicAIIcon, DynamicBSIcon, IconButton } from '../../../all/all_m';
import { SearchInput } from '../../../../../components/invt/inventory/list/SearchInput';
import { Inventory } from './Inventory';
import { getList } from '../../../../../services';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { message } from 'antd';

export function Search(props){
  const { handleEnter, size, data, setData, siteId, setSiteId, check} = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const copiedItems = useSelector(state => state.temp.copiedItems);
  const { user, token }  = useSelector(state => state.login);

  const onClickPaste = async (e) => {
    e?.preventDefault();
    if (!copiedItems.length) return;
  
    setLoading(true);
  
    try {
      const query = siteId?.value !== -1 ? `?SiteID=${siteId?.value}` : "";
      const api = `Inventory/SelectInventory${query}`;
      const response = await dispatch(getList(user, token, api));
      const serviceData = response?.data || [];
      setLoading(false);
  
      if (!copiedItems?.length) {
        message.error(t("count.no_data"));
        return;
      }
  
      const datas = [];
  
      copiedItems.forEach((l) => {
        const invtId = l?.msInventory?.invtId || l?.invtId;
        const invtName = l?.msInventory?.name || l?.name;
        if (!invtId) return;
  
        const found = serviceData.find(
          (srv) => srv?.invtId === invtId
        );

        if (found) {
          datas.push({
            ...found,
            name: found?.invtDescr,
            countQty: found?.qty ? found?.qty : 0,
            siteQty: found?.qty ? found?.qty : 0,
            origCost: found?.cost ? found?.cost : 0,
            itemType: "RC",
            qty: 0,
            itemStatus: 0,
            picountItemId: 0,
            notes: "",
            rowStatus: "I",
            status: 1,
          });
        } else {
          message.error(`${'Энэ салбар дээр '}` + `${invtName}` + `${' бараа олдсонгүй'}`);
        }
      });
  
      setData((old) => {
        const newList = [...old];
        datas.forEach((inv) => {
          const exists = newList.findIndex((d) => d.invtId === inv?.invtId);
          if (exists === -1) newList.push(inv);
        });
        return newList;
      });
    } catch (err) {
      setLoading(false);
    }
  };
  

  const onClickSearch = () => setShowSearch(!showSearch);

  const changeSearch = value => {
    setSearch(value);
    handleEnter(value);
  }

  const onClick = (e) => {
    e?.preventDefault();
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }
  
  
  const id = size?.width > 780 ? 'ih_large' : 'ih_small';

  const width = showSearch ? 0 : 220;
  const width1 = !showSearch ? 0 : (size?.width > 430 ? 320 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch: changeSearch, width: width1, className: 'po_search_input' };
  const addProps = { className: 'po_add_btn', text: t('count.invt_add'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, onClick, disabled: !siteId?.value };
  const modalProps = { visible, closeModal, data , setItem: setData, setVisible, item: data, siteId, setSiteId, check};
  const pasteProps = {onClick: onClickPaste, text: 'Paste', className: 'ih_btn', loading, disabled: siteId?.value ? false : true};

  return (
    <div className='po_search_back' id={id}>
      {visible && <Inventory {...modalProps}/>}
      <p className='ac_title'>{t('inventory.title')}</p>
      <div className='ac_row_back' style={style}>
        <Button {...pasteProps}/>
        <IconButton {...addProps} />
        <div className='po_search_icon'><DynamicAIIcon {...searchProps} /></div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}