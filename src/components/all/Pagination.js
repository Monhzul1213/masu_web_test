import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const { Option } = Select;

export function Pagination(props){
  const { total, setStart, setEnd } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [count, setCount] = useState(1);
  const pageRange = [2, 10, 25, 50, 100];

  useEffect(() => {
    setCount(Math.ceil(total / pageSize));
    setStart((page - 1) * pageSize);
    setEnd(page * pageSize);
    return () => {};
  }, [total, pageSize]);

  const onClick = inc => {
    let newPage = page + inc;
    setPage(newPage);
    setStart((newPage - 1) * pageSize);
    setEnd(newPage * pageSize);
  }

  const onChange = e => {
    console.log(e);
  }

  const onBlur = e => {

  }

  const onKeyDown = e => {

  }

  return (
    <div className='pg_back'>
      <button className='pg_btn' onClick={() => onClick(-1)}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={page} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {count}</p>
      </div>
      <button className='pg_btn' onClick={() => onClick(1)}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div className='pg_select_back'>
        <Select
          className='pg_select'
          value={pageSize}
          onSelect={e => setPageSize(Number(e))}>
          {pageRange?.map(item => {
            return (<Option key={item} value={item}>{item}</Option>)
          })}
        </Select>
      </div>
    </div>
  );
}