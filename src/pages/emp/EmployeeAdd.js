import React, { useState } from 'react';

import '../../css/invt.css';
import { Error1, Overlay, Prompt } from '../../components/all';
import { CardMain } from '../../components/emp/employee/add';

export function EmployeeAdd(props){
  const { } = props;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState({ value: '' });
  const [mail, setMail] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [role, setRole] = useState({ value: null });
  const [code, setCode] = useState({ value: '' });
  const [invite, setInvite] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);

  let mainProps = { setError, setEdited, name, setName, mail, setMail, phone, setPhone, role, setRole, code, setCode, invite, setInvite };

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