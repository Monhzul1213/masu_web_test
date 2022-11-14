import React, { useState } from 'react';

import '../../css/invt.css';
import { Error1, Overlay, Prompt } from '../../components/all';
import { CardMain } from '../../components/emp/employee/add';

export function EmployeeAdd(props){
  const { } = props;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState({ value: '' });
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);

  let mainProps = { setError, setEdited, name, setName };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <CardMain {...mainProps} />
        </form>
      </div>
    </Overlay>
  );
}