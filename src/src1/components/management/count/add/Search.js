import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon, DynamicBSIcon, IconButton } from '../../../all/all_m';
import { SearchInput } from '../../../../../components/invt/inventory/list/SearchInput';
import { Inventory } from './Inventory';
// import { Button } from '../../../../../components/all';
import { Import } from './Import';
import { ExportExcel } from '../../../../../helpers';

export function Search(props){
  const { handleEnter, size, data, setData, siteId, setSiteId, status, columns} = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

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
  
  const closeModal1 = () => {
    setOpen(false)
  }

  // const onClickVisible = e => {
  //   e?.preventDefault();
  //   setOpen(siteId?.value && (status?.value !== 0 && status?.value !== 3) ? true : false)
  // }

  const id = size?.width > 780 ? 'ih_large' : 'ih_small';

  const width = showSearch ? 0 : 160;
  const width1 = !showSearch ? 0 : (size?.width > 430 ? 320 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch: changeSearch, width: width1, className: 'po_search_input' };
  const addProps = { className: 'po_add_btn', text: t('count.invt_add'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, onClick, disabled: !siteId?.value || status?.value !== 0 ? true : false };
  const modalProps = { visible, closeModal, data , setItem: setData, setVisible, item: data, siteId, setSiteId};
  // const importProps = {  className: 'ih_btn', text: t('page.import'), onClick: onClickVisible};
  const importModalProps = { visible: open, closeModal: closeModal1, setVisible: setOpen, data, setData, columns, siteId};
  const exportProps = { text: t('page.export'), columns: columns, excelData: data, fileName: t('header./management/count')};

  return (
    <div className='po_search_back' id={id}>
      {visible && <Inventory {...modalProps}/>}
      {open && <Import {...importModalProps}/>}
      <div className='ih_header1'>
        <p className='ac_title'>{t('inventory.title')}</p>
        {/* <Button {...importProps} /> */}
        <ExportExcel {...exportProps} />
      </div>
      <div className='ac_row_back' style={style}>
        <IconButton {...addProps} />
        <div className='po_search_icon'><DynamicAIIcon {...searchProps} /></div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}