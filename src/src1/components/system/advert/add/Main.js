import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { Input , UploadImage, Radio } from '../../../all/all_m';
import { Date, Select } from '../../../../../components/all';

 function Card(props){
  const {setEdited, setError, name, setName, link, setLink, setBeginDate, beginDate,
    endDate, setEndDate, image, setImage,size,  setImage64, setImageType, status, setStatus, type, setType} = props;
  const { t } = useTranslation();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const id = size?.width > 480 ? 'im_large' : 'im_small';

  const nameProps = { value: name, setValue: setName, label: t('advert.name'), placeholder: t('advert.name'), setError, setEdited,};
  const codeProps = { value: link, setValue: setLink, label: t('advert.link'), placeholder: t('advert.link'), setError, setEdited,};
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image_z' };
  const beginProps = { value: beginDate, setValue: setBeginDate, label: t('invoice.begin'), inRow: true };
  const endProps = { value: endDate, setValue: setEndDate, label: t('invoice.end'), inRow: true };
  const statusProps = { value: status, setValue: setStatus, label: t('order.status'), data: t('advert.status'), setError, setEdited };
  const typeProps = {value: type, setValue: setType, label: t('advert.type'), placeholder: t('advert.type'), setError, setEdited, data: t('advert.types')};

  return (
    <div className='ac_back_z' id={id}>
      <form>
            <UploadImage {...imageProps} />
            <Input {...nameProps}  />
            <Select {...typeProps}/>
            <div className='ac_row' style={{marginTop: 20}}>
              <Date {...beginProps} />
              <div className='gap' />
              <Date {...endProps} />
            </div>
            <Input {...codeProps}  />
            <Radio {...statusProps}/> 
        </form>
    </div>
    
  )
}
const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);