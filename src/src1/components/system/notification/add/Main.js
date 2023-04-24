import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {  Date, Radio, Selects} from '../../../all/all_m';
import { withSize } from 'react-sizeme';
import {types} from '../../../../../helpers'
import { Input, CheckBox } from '../../../../../components/all';

 function Card(props){
  const {setEdited,size,  setError, subject, setSubject, text, setText, setBeginDate, beginDate,
    endDate, setEndDate, status, setStatus, type, setType, isService, setIsService} = props;
  const { t } = useTranslation();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow1 = size?.width > 480 ? 'im_unit_row_large' : 'im_unit_row_small';

  const subProps = { value: subject, setValue: setSubject, label: t('noti.subject'), placeholder: t('noti.subject'), setError, setEdited, length:100};
  const textProps = { value: text, setValue: setText, label: t('noti.text'), placeholder: t('noti.text'), setError, setEdited, length:300};
  const beginProps = { value: beginDate, setValue: setBeginDate, label: t('invoice.begin'), inRow: true, };
  const endProps = { value: endDate, setValue: setEndDate, label: t('invoice.end'), inRow: true,};
  const statusProps = { value: status, setValue: setStatus, label: t('order.status'), data: t('advert.types'), setError, setEdited };
  const merchProps = { value: type, setValue: setType, label: t('noti.type'), setError, setEdited, inRow: false,
  data: types};
  const serviceProps = { label: t('noti.service'), checked: isService, setChecked: setIsService };

  return (
    <div className='ac_back_sys' id={id}>
      <form>
            <Selects {...merchProps} />
            <div className='ac_row' style={{marginTop: 20}}>
              <Date {...beginProps} />
              <div className='gap' />
              <Date {...endProps} />
            </div>            
            <Input {...subProps}  />
            <Input {...textProps}  />
            <div id={idRow1}>
              <Radio {...statusProps} />
              <div className='im_gap' />
              <CheckBox {...serviceProps} />
          </div>
        </form>
    </div>
    
  )
}
const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);