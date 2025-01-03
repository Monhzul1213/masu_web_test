import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ButtonRowAdd, DynamicAIIcon, Button, PlainSelect } from '../../all/all_m'
import { Search } from './Search';
import { ExportExcel } from '../../../../helpers';
import { getServiceBar } from '../../../../services';

export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch, size , columns, data, excelName, setError} = props;
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  // const [classH, setClassH] = useState('th_header1');
  const [branch, setBranch] = useState(-1);
  const [branchs, setBranchs] = useState([]);
  const [subBranchs, setSubBranchs] = useState([]);
  const [subBranch, setSubBranch] = useState(-1);
  const [allBranchs, setAllBranchs] = useState([]);
  const [isAr, setIsAr] = useState(-1);
  const [isArs, setIsArs] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusBranch();
    onFocusIsAr();
    setSubBranchs([{subBranchCode: -1, subBranchName: t('Бүгд')}])
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if(size?.width >= 890) setClassH('th_header1');
  //   else if(size?.width < 890 && size?.width >= 660) setClassH('th_header2');
  //   else setClassH('th_header3');
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [size?.width]);

  const onFocusBranch = async () => {
    if(!branchs?.length || branchs?.length === 1){
      setError && setError(null);
      setLoading('site');
      const response = await dispatch(getServiceBar('getBranchInfo'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [];
        response?.data?.data?.forEach(item => {
          let index = data?.findIndex(list => item.branchCode === list.branchCode )
          if(index === -1 ) data.push(item)
        })
        let data1 = [...[{branchCode: -1, branchName: t('Бүгд')}], ...data];
        setBranchs(data1?.sort((a, b)=> a?.branchCode - b?.branchCode));
        setAllBranchs(response?.data?.data)
      }
      setLoading(null);
    }
  }

  const onFocusIsAr = async () => {
    if(!isArs?.length || isArs?.length === 1){
      setIsArs([
        { valueNum: -1, valueStr1: t('Бүгд') },
        { valueNum: 'Y', valueStr1: 'Авлагатай' },
        { valueNum: 'N', valueStr1: 'Авлагагүй' },
      ]); 
    }
  }

  const onHide = (branch, subBranch, isAr, name) => {
    let query = '';
    if(branch !== -1) query += '?BranchCode=' + branch;
    if(branch !== -1 && subBranch !== -1) query += '&SubBranchCode=' + subBranch;
    if(isAr !== -1) query += (branch === -1 ? '?' : '&') + 'IsAr=' + isAr;
    // query += '?CustName=' + name;
    onSearch( query);
  }

  const handleEnter = (value) => {
    // let query = '?CustName=' + value;
    // onSearch( query);
  }

  const onChangeBranch = value => {
    setBranch(value);
    let data1 = [...[{subBranchCode: -1, subBranchName: t('Бүгд')}], ...allBranchs?.filter(item => item?.branchCode?.includes(value))];
    setSubBranchs(data1);
    setSubBranch(-1);
    onHide(value, subBranch, isAr, search);
  }
  
  const onChangeSubBranch = value => {
    setSubBranch(value);
    onHide(branch, value, isAr, search);
  }
  const onChangeIsAr = value => {
    setIsAr(value);
    onHide(branch, subBranch, value, search);
  }
  const onClickImport = () => navigate('/customer/customer_import');

  const width = showSearch ? 0 : (size?.width > 780 ? 620 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 320 : (size?.width - 20));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const id = size?.width > 700 ? 'ih_large' : 'ih_small';
  const classBack = 'cou_select_back1', classLabel = 'ih_select_lbl', className = 'ih_select';

  const onClickSearch = () => setShowSearch(!showSearch);
  const addProps = { type: 'customer', onClickAdd, show, onClickDelete };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show , className: 'rp_list_search_back1' };
  const importProps = {  className: 'ih_btn', text: t('page.import'), onClick: onClickImport };
  const exportProps = { text: t('page.export'), columns: columns, excelData: data, fileName: excelName};

  const branchProps = { value: branch, setValue: onChangeBranch, data: branchs, s_value: 'branchCode', s_descr: 'branchName',
  label: t('shop.city'), classBack, classLabel, className, loading };
  const subBranchProps = { value: subBranch, setValue: onChangeSubBranch, data: subBranchs, s_value: 'subBranchCode', s_descr: 'subBranchName',
  label: t('shop.district'), onFocus: onFocusBranch, classBack, classLabel, className };
  const isArProps = { value: isAr, setValue: onChangeIsAr, data: isArs, s_value: 'valueNum', s_descr: 'valueStr1',
  label: t('customer.receivable'), onFocus: onFocusIsAr, classBack, classLabel, className };

  return (
    <div className='ih_header' id={id}  >  
      <div className='ih_header1'>
        <ButtonRowAdd {...addProps} />
        <div className='ih_btn_row' >
          <Button {...importProps} />
          <ExportExcel {...exportProps} />
        </div>
      </div>
      <div className={'ih_header2'} style={style}>
          <PlainSelect {...branchProps} />
        {/* <div className='th_header_s' > */}
          <PlainSelect {...subBranchProps} />
          <PlainSelect {...isArProps} />
          <DynamicAIIcon {...searchProps} style={{marginTop: 17}}/>
        {/* </div> */}
      </div>
      <Search {...inputProps} />
      {/* <div className='rp_list_filter_icon' style={style}><DynamicAIIcon {...searchProps} /></div> */}
    </div>
  );
}