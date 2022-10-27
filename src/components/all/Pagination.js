import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const { Option } = Select;

export function Pagination(props){
  const { total, setStart, setEnd } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const pageRange = [10, 25, 50, 100];

  useEffect(() => {
    onSizeChange(pageSize, total);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const onClick = newPage => {
    setPage(newPage);
    setStart((newPage - 1) * pageSize);
    setEnd(newPage * pageSize);
  }

  const onSizeChange = (size, total1) => {
    setPageSize(size);
    setCount(Math.ceil(total1 / size));
    let start = (page - 1) * size;
    if(start >= total1){
      setPage(1);
      setStart(0);
      setEnd(size);
    } else {
      setStart(start);
      setEnd(page * size);
    }
  }

  const onChange = e => {
    let value = parseInt(e.target.value);
    if(isNaN(value)){
      setPage('');
    } else if(value <= count){
      setPage(value);
    }
  }

  const onBlur = () => {
    onClick(page ? page : 1);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") onClick(page ? page : 1);
  }

  return (
    <div className='pg_back'>
      <button className='pg_btn' disabled={page <= 1} onClick={() => onClick(page - 1)}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={page} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {count}</p>
      </div>
      <button className='pg_btn' disabled={page >= count} onClick={() => onClick(page + 1)}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div className='pg_select_back'>
        <Select
          className='pg_select'
          value={pageSize}
          onSelect={e => onSizeChange(Number(e))}>
          {pageRange?.map(item => {
            return (<Option key={item} value={item}>{item}</Option>)
          })}
        </Select>
      </div>
    </div>
  );
}