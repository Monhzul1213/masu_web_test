import React from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { types } from '../../../../../helpers'
import { Date } from '../../../../../components/all';
import { CardNote, Radio, Selects } from '../../../all/all_m';
import { Rating } from './Rating';

 function Card(props){
  const {setEdited,size,  setError, text, setText, setBeginDate, beginDate,
    endDate, setEndDate, status, setStatus, type, setType, rate, selected} = props;
  const { t } = useTranslation();


  const handleEnter = e => {
    if (e?.key?.toLowerCase() === "enter") {
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
}

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  // const idRow1 = size?.width > 480 ? 'im_unit_row_large' : 'im_unit_row_small';

  const textProps = { value: text, setValue: setText, label: t('rating.title'), placeholder: t('rating.title'), setError, setEdited, length:200, handleEnter};
  const beginProps = { value: beginDate, setValue: setBeginDate, label: t('invoice.begin'), inRow: true, };
  const endProps = { value: endDate, setValue: setEndDate, label: t('invoice.end'), inRow: true,};
  const statusProps = { value: status, setValue: setStatus, label: t('order.status'), data: t('advert.types'), setError, setEdited };
  const merchProps = { value: type, setValue: setType, label: t('noti.type'), setError, setEdited, inRow: false, data: types};
  const rateProps = { selected, rate }

  return (
    <div className='ac_back_sys1' id={id}>
      <form>
            <Selects {...merchProps} />
            <div className='ac_row' style={{marginTop: 20}}>
              <Date {...beginProps} />
              <div className='gap' />
              <Date {...endProps} />
            </div>            
            <CardNote {...textProps} />
            <div className='rate_back'>
              {/* <div id={idRow1}> */}
                <Radio {...statusProps} />
              {/* </div> */}
              <Rating {...rateProps}/>
            </div>
        </form>
    </div>
    
  )
}
const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);