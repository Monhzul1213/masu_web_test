import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function CardNote(props){
  const { label, value, setValue, handleEnter, disabled , inRow, placeholder, length, setError, setEdited} = props;
  const { t } = useTranslation();

  const onChange = e => {
    e?.target?.value?.length > length 
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key === 'Enter') handleEnter && handleEnter(e);
  }
  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='cust_back' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <textarea className='c_input'
          disabled={disabled}
          value={value?.value}
          onChange={onChange} 
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>

  )
}

export function CardHtmlNote(props){
  const { label, value, setValue, handleEnter, disabled , inRow, placeholder, setError, setEdited} = props;
  const { t } = useTranslation();


  const handleChange = (content) => {
    setValue && setValue({ ...value, value: content }); // HTML хадгалах
    setError && setError(null);
    setEdited && setEdited(true);
  };

  const formats = [
    'font','size',
    'bold','italic','underline','strike',
    'color','background',
    'script',
    'header','blockquote','code-block',
    'indent','list',
    'direction','align',
    'link','image','video','formula',
  ];

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'header': '1' }, { 'header': '2' }, ],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'formula'],
      ['clean']
    ]
  };

  const onKeyDown = e => {
    if (e?.key === 'Enter') handleEnter && handleEnter(e);
  };

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? { ...style, margin: '0' } : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='cust_back' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <ReactQuill
          disabled={disabled}
          formats={formats}
          modules={modules}
          theme="snow"
          value={value?.value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}