import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, UploadImage, Radio, Select } from '../../../all/all_m';
import { withSize } from 'react-sizeme';
import { Date } from '../../../../../components/all';

function Card({
  setEdited, setError, name, setName, link, setLink, setBeginDate, beginDate,
  endDate, setEndDate, image, setImage, size, setImage64, setImageType,
  status, setStatus, site, setSite, type, setType
}) {
  const { t } = useTranslation();

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const nameProps = { value: name, setValue: setName, label: t('advert.name'), placeholder: t('advert.name'), setError, setEdited };
  const codeProps = { value: link, setValue: setLink, label: t('advert.link'), placeholder: t('advert.link'), setError, setEdited };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image_z' };
  const beginProps = { value: beginDate, setValue: setBeginDate, label: t('invoice.begin'), inRow: true };
  const endProps = { value: endDate, setValue: setEndDate, label: t('invoice.end'), inRow: true };
  const statusProps = { value: status, setValue: setStatus, label: t('advert.status'), data: t('advert.statusl'), setError, setEdited };
  const typeProps = { value: type, setValue: setType, label: t('advert.type'), placeholder: t('advert.type'), setError, setEdited, data: t('advert.types') };
  const siteProps = { value: site, setValue: setSite, label: t('advert.shop'), placeholder: t('advert.shop'), setError, setEdited };

  return (
    <div className='ac_back_z' id={id}>
      <form>
        <UploadImage {...imageProps} />
        <Input {...nameProps} />
        <Input {...siteProps} />
        <Select {...typeProps} />
        <div className='ac_row' style={{ marginTop: 20 }}>
          <Date {...beginProps} />
          <div className='gap' />
          <Date {...endProps} />
        </div>
        <Input {...codeProps} />
        <Radio {...statusProps} />
      </form>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);