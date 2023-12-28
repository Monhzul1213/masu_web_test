import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const { Option } = Select;

export function Pagination(props){
  const { total, setStart, setEnd, size } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(size ? size : 10);
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
    const scroll = document.getElementById('paging');
    if(scroll) scroll.scrollTop = 0;
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
    const scroll = document.getElementById('paging');
    if(scroll) scroll.scrollTop = 0;
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
          onSelect={e => onSizeChange(Number(e), total)}>
          {pageRange?.map(item => {
            return (<Option key={item} value={item}>{item}</Option>)
          })}
        </Select>
      </div>
    </div>
  );
}

export function PaginationTable(props){
  const { tableInstance } = props;
  const [page, setPage] = useState(1);
  const pageRange = [10, 25, 50, 100];
  const { canPreviousPage, canNextPage, pageCount, gotoPage, nextPage, previousPage, setPageSize,
    state: { pageIndex, pageSize }} = tableInstance;

  useEffect(() => {
    setPage(pageIndex + 1);
    const scroll = document.getElementById('paging');
    if(scroll) scroll.scrollTop = 0;
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const onChange = e => {
    let value = parseInt(e.target.value);
    if(isNaN(value)){
      setPage('');
    } else if(value <= pageCount){
      setPage(value);
    }
  }

  const onBlur = () => {
    gotoPage(page ? page - 1 : 0);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") gotoPage(page ? page - 1 : 0);
  }

  return (
    <div className='pg_back'>
      <button className='pg_btn' disabled={!canPreviousPage} onClick={() => previousPage()}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={page} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {pageCount}</p>
      </div>
      <button className='pg_btn' disabled={!canNextPage} onClick={() => nextPage()}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div style={{padding: 5}} />
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


export function PaginationList(props){
  const { pageInfo, getInventory } = props;
  const [value, setValue] = useState(1);
  const pageRange = [10, 25, 50, 100];
  const page = pageInfo?.pageNumber ?? 1;
  const count = pageInfo?.totalPage ?? 1;

  useEffect(() => {
    setValue(pageInfo?.pageNumber);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo?.pageNumber]);

  const onClick = pageNumber => getInventory({...pageInfo, pageNumber });

  const onSizeChange = pageSize => getInventory({...pageInfo, pageSize });

  const onChange = e => {
    let value = parseInt(e.target.value);
    if(isNaN(value)) setValue('');
    else setValue(value)
  }

  const onBlur = () => onClick(value ? value : 1);

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") onClick(value ? value : 1);
  }

  return (
    <div className='pg_back'>
      <button className='pg_btn' disabled={page <= 1} onClick={() => onClick(page - 1)}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={value} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {count}</p>
      </div>
      <button className='pg_btn' disabled={page >= count} onClick={() => onClick(page + 1)}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div className='pg_select_back'>
        <Select
          className='pg_select'
          value={pageInfo?.pageSize}
          onSelect={e => onSizeChange(Number(e))}>
          {pageRange?.map(item => {
            return (<Option key={item} value={item}>{item}</Option>)
          })}
        </Select>
      </div>
    </div>
  );
}