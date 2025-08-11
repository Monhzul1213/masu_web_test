import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Select, UploadImage } from '../../all';
import { getList } from '../../../services';

export function FinanceMain(props){
  const { name, setName, director, setDirector, accountant, setAccountant, setError, setEdited, image, setImage, setImage64, setImageType, setFtime, Ftime} = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([{ value: 'S', label: "Улирал" }]);
  const [disabled, setDisabled] = useState(false)
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusStatus();
    getConfig();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusStatus = async () => {
    if (!states?.length || states?.length === 1) {
      setStates([
        { value: 'S', label: "Улирал" },
        { value: 'M', label: "Сар" },
        { value: 'HY', label: "Хагас жил" },
        { value: 'Y', label: "Жил" }
      ]);
    }
  };

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setDisabled(response?.data?.subscriptionType === 'PREMIUM' ? false : true);
  }

  const nameProps = { value: name, setValue: setName, label: t('config.merchantName'), placeholder: t('config.merchantName'), setError, 
                      setEdited, inRow: true, id: 'fi_input_back', disabled, id1: disabled && 'fi_input_label'};
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'fi_image', disabled };
  const direcProps = { value: director, setValue: setDirector, label: t('config.director'), placeholder: t('config.director'), setError, 
                      setEdited, id: 'fi_input_back', disabled, id1: disabled && 'fi_input_label'};
  const accProps = { value: accountant, setValue: setAccountant, label: t('config.accountant'), placeholder: t('config.accountant'), setError, 
                      setEdited, id: 'fi_input_back', disabled, id1: disabled && 'fi_input_label'};
  const selectProps = { value: Ftime, setValue: setFtime, data: states, s_value: "value", s_descr: "label", label: t("config.report_time"), 
                      placeholder: t("config.report_time"), onFocus: onFocusStatus, id: 'fi_input_back', disabled: true, id1: disabled && 'fi_input_label'};

  return (
    <div className='fi_tab_back'>
        <div style={{flex: 1}}>
            <Input {...nameProps} />
            <Input {...direcProps}/>
            <Input {...accProps}/>
            <Select {...selectProps}/>
        </div>
        <div>
          <p className='select_lbl_z' id={disabled && 'select_lbl_fi'}>{t('document.logo')}</p>
          <UploadImage {...imageProps}/>
        </div>
    </div>
  )
}