import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FloatingInput, Button } from '../all/all_m';
import { withSize } from 'react-sizeme';
import { useDispatch } from 'react-redux';
import { getService } from '../../../services';

 function Card(props){
  const {size, checked, customer, setCustomer, contact, setContact } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  // const [cust, setCust] = useState({ value: '' });
  // const [cont, setCont] = useState({ value: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCustomer = async e => {
    e?.preventDefault();
    setLoading(true);
    let api = 'Merchant/GetPartner?partnercode=' + customer?.value;
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setCustomer({...customer, error: response?.error });
    else {
      let name = response?.data?.retdata?.partner?.partnerName ?? '';
      setCustomer({...customer, name, error: null });
    }
    setLoading(false);
  }

  const handleContact = async e => {
    e?.preventDefault();
    setLoading(true);
    let api = 'Merchant/GetPartner?partnercode=' + contact?.value;
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setContact({...contact, error: response?.error });
    else {
      let name = response?.data?.retdata?.partner?.partnerName ?? '';
      setContact({...contact, name, error: null });
    }
    setLoading(false);
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const disabled = customer?.value ? false : true;
  const disable = contact?.value ? false : true;
  const custProps = { text: t('supplier.custCode'), value: customer, setValue: setCustomer, handleEnter: handleCustomer, id: 'l_partner', disabled: checked === false ? true : false };
  const custBtnProps = { className: 'l_check_btn', text: t('tax.check'), onClick: handleCustomer, disabled, loading };
  const custNameProps = { text: t('supplier.custName'), value: { value: customer?.name ?? '' }, disabled: true };
  const contactProps = { text: t('supplier.contCode'), value: contact, setValue: setContact, handleEnter: handleContact, id: 'l_partner', disabled: checked === false ? true : false };
  const contactBtnProps = { className: 'l_check_btn', text: t('tax.check'), onClick: handleContact, disable, loading };
  const contactNameProps = { text: t('supplier.contName'), value: { value: contact?.name ?? '' }, disabled: true };

  return (
    <div className='ac_back_sz' id={id}>
      <p className= {checked === true ? 'supp_lbl_check' : 'supp_lbl'}>{t('supplier.order')}</p>
      {/* <form> */}
            <div className='m_back_z'>
              <div className='l_partner_row'>
                <FloatingInput {...custProps} />
                <Button {...custBtnProps} />
              </div>
              <FloatingInput {...custNameProps} />
            </div>
            <div className='m_back_z'>
              <div className='l_partner_row'>
                <FloatingInput {...contactProps} />
                <Button {...contactBtnProps} />
              </div>
              <FloatingInput {...contactNameProps} />
            </div>
        {/* </form> */}
    </div>
    
  )
}
const withSizeHOC = withSize();
export const Check = withSizeHOC(Card);