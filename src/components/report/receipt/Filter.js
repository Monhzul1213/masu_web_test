import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect, PlainSelect, TimeRange } from '../../all';

export function Filter(props){
  const { setError, size, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment(), moment()]);
  const [time, setTime] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [emps, setEmps] = useState([]);
  const [emp, setEmp] = useState([]);
  const [isBonus, setIsBonus] = useState();
  const [Bbonus, setBBonus] = useState([{ value: -1, label: 'Бүгд'}]);
  const [voucher, setVoucher] = useState();
  const [vouchers, setVouchers] = useState([{ value: -1, label: 'Бүгд'}]);
  const [coupon, setCoupon] = useState();
  const [coupons, setCoupons] = useState([{ value: -1, label: 'Бүгд'}]);
  const [discount, setDiscount] = useState();
  const [discounts, setDiscounts] = useState([{ value: -1, label: 'Бүгд'}]);
  const [giftCard, setGiftCard] = useState();
  const [giftCards, setGiftCards] = useState([{ value: -1, label: 'Бүгд'}]);
  const [classH, setClassH] = useState('rp_h_back1');
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [class1, setClass1] = useState('rp_header_back1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 1100) setClassH('rp_h_back2');
    else if(size?.width < 1100 && size?.width >= 500) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    if(size?.width >= 700) setClass1('rp_header_back1');
    else if(size?.width < 700 && size?.width >= 50) setClass1('rp_header_back2');
    else setClass1('rp_header_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = (bonus, voucher, coupon, discount, giftCard) => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(time) query += '&BeginTime=' + time[0] + '&EndTime=' + time[1]
    if(emp?.length !== emps?.length) emp?.forEach(item => query += '&EmpCode=' + item);
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    if(bonus !== -1 && bonus !== undefined ) query += '&useBonus=' + bonus;
    if(voucher !== -1 && voucher !== undefined ) query += '&useVoucher=' + voucher;
    if(coupon !== -1 && coupon !== undefined) query += '&useCoupon=' + coupon;
    if(discount !== -1 && discount !== undefined) query += '&useDiscount=' + discount;
    if(giftCard !== -1 && giftCard !== undefined) query += '&GiftCardID=' + giftCard;
    onSearch && onSearch(query, filter1, date);
  }

  const onFocusSite = async () => {
    if(!sites?.length){
      setError && setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        setSites(response?.data);
        setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }

  const onFocusEmp = async () => {
    if(!emps?.length){
      setError && setError(null);
      setLoading('emps');
      const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
      if(response?.error) setError && setError(response?.error);
      else {
        setEmps(response?.data);
        setEmp(response?.data?.map(item => item.empCode));
      }
      setLoading(false);
    }
  }

  const onFocusBonus = async () => {
    if(!Bbonus?.length || Bbonus?.length === 1){
      setBBonus([
        { value: -1, label: 'Бүгд' },
        { value: 1, label: 'Урамшуулал ашигласан' },
        { value: 0, label: 'Урамшуулал ашиглаагүй' },
      ]);
    }
  }

  const onFocusVoucher = async () => {
    if(!vouchers?.length || vouchers?.length === 1){
      setVouchers([
        { value: -1, label: 'Бүгд' },
        { value: 1, label: 'Ваучер ашигласан' },
        { value: 0, label: 'Ваучер ашиглаагүй' },
      ]);
    }
  }
  const onFocusCoupon = async () => {
    if(!coupons?.length || coupons?.length === 1){
      setCoupons([
        { value: -1, label: 'Бүгд' },
        { value: 1, label: 'Купон ашигласан' },
        { value: 0, label: 'Купон ашиглаагүй' },
      ]);
    }
  }

  const onFocusDiscount = async () => {
    if(!discounts?.length || discounts?.length === 1){
      setDiscounts([
        { value: -1, label: 'Бүгд' },
        { value: 1, label: 'Хөнгөлөлт ашигласан' },
        { value: 0, label: 'Хөнгөлөлт ашиглаагүй' },
      ]);
    }
  }

  const onFocusGiftCard = async () => {
    if(!giftCards?.length || giftCards?.length === 1){
      setGiftCards([
        { value: -1, label: 'Бүгд' },
        { value: 1, label: 'GiftCard ашигласан' },
        { value: 0, label: 'GiftCard ашиглаагүй' },
      ]);
    }
  }

  const onChangeBonus = value => {
    setIsBonus(value)
    onHide(value, voucher, coupon, discount, giftCard)
  }

  const onChangeVoucher = value => {
    setVoucher(value)
    onHide(isBonus, value, coupon, discount, giftCard)
  }

  const onChangeCoupon = value => {
    setCoupon(value)
    onHide(isBonus, voucher, value, discount, giftCard)
  }

  const onChangeDiscount = value => {
    setDiscount(value)
    onHide(isBonus, voucher, coupon, value, giftCard)
  }

  const onChangeGiftCard = value => {
    setGiftCard(value)
    onHide(isBonus, voucher, coupon, discount, value)
  }

  const onClick = () => {
    setVisible(true);
    setOpen(false);
  }
  
  const onClick1 = () => {
    setVisible(false);
    setOpen(true);
  }
  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const timeProps = { value: time, setValue: setTime, onHide, classBack: 'rp_time_back', label: t('report_receipt.all_day') };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rep_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 150 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop') };
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rep_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 150 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp') };

  const classBack = 'rep_select_back2', className = 'rp_select';
  const bonusProps = { value: isBonus, setValue: onChangeBonus, data: Bbonus, s_value: 'value', s_descr: 'label', onFocus: onFocusBonus, className, classBack, dropdownStyle: { marginLeft: -30, minWidth: 200 }, placeholder: t('menu.bonus') };
  const voucherProps = { value: voucher, setValue: onChangeVoucher, data: vouchers, s_value: 'value', s_descr: 'label', onFocus: onFocusVoucher, className, classBack, dropdownStyle: { marginLeft: -30, minWidth: 160 }, placeholder: t('voucher.voucher') };
  const couponProps = { value: coupon, setValue: onChangeCoupon, data: coupons, s_value: 'value', s_descr: 'label', onFocus: onFocusCoupon, className, classBack, dropdownStyle: { marginLeft: -30, minWidth: 160 }, placeholder: t('coupon.coupon') };
  const disProps = { value: discount, setValue: onChangeDiscount, data: discounts, s_value: 'value', s_descr: 'label', onFocus: onFocusDiscount, className, classBack, dropdownStyle: { marginLeft: -30, minWidth: 190 }, dropdownAlign: { offset: [-30, 5] }, placeholder: t('discount.title') };
  const giftProps = { value: giftCard, setValue: onChangeGiftCard, data: giftCards, s_value: 'value', s_descr: 'label', onFocus: onFocusGiftCard, className, classBack, dropdownStyle: { marginLeft: -30, minWidth: 190 }, dropdownAlign: { offset: [-30, 5] }, placeholder: t('giftCard.title') };
  const moreProps = { name: 'AiOutlineDown', onClick, className: 'rcp_icon_back'};
  const upProps = { name : 'AiOutlineUp', onClick: onClick1, className: 'rcp_icon_back'};

  return (
    <div className={classH}>
      <div className={class1}>
        <div className='rp_h_row1'>
          <MonthRange {...dateProps} />
          <TimeRange {...timeProps} />
        </div>
        <div className='rp_header_row2'>
          <MultiSelect {...siteProps} />
          <MultiSelect {...empProps} />
          {open ? <DynamicAIIcon {...moreProps} /> : <DynamicAIIcon {...upProps}/>}
        </div>
      </div>
      {visible && <div className='rp_h_bonus_back'>
        <PlainSelect {...bonusProps} />
        <PlainSelect {...voucherProps} />
        <PlainSelect {...couponProps} />
        <PlainSelect {...disProps} />
        <PlainSelect {...giftProps} />
      </div>}
    </div>
  );
}