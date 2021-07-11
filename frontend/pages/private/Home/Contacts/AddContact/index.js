import React, { useState } from 'react';
import { AutoComplete, Alert, Modal } from 'antd';
import { axios } from 'helpers';
import { useStore } from 'helpers/hooks';
import { observer } from 'mobx-react-lite';
import s from './index.scss';

export default observer(function AddContact ({ visible, onChange }) {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const user = useStore('user');

  async function onSearch (login) {
    if (login.length >= 3) {
      const res = await axios.get('users', { params: {
        login,
        excludeIds: [user.data._id, ...user.data.contacts]
      } });
      setUsers(res.data);
    } else {
      setUsers([]);
    }
  }

  function onSelect (value) {
    setInput('');
    setSelectedUserId(value);
  }

  async function onModalOk () {
    if (selectedUserId) {
      await axios.post('users/contacts/add', {
        contactId: selectedUserId,
        userId: user.data._id
      });

      const res = await axios.get('get-me');
      user.set(res.data);
    }

    onChange(false);
  }

  function onAlertClose () {
    setSelectedUserId('');
    setUsers([]);
  }

  const selectedUser = users.find(u => u._id === selectedUserId);

  return (
    <Modal
      title="Add contact"
      width={320}
      visible={visible}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={onModalOk}
      onCancel={()=> onChange(false)}
      okText={selectedUserId ? 'Add' : 'Ok'}
    >
      {
        !!selectedUserId &&
        <Alert
          closable={true}
          className={s.tagUser}
          message={selectedUser.login}
          onClose={onAlertClose}
        />
      }

      {
        !selectedUserId &&
        <div className={s.inputWrapper}>
          <AutoComplete
            options={users.map(u => ({ label: u.login, value: u._id }))}
            className={s.autoComplete}
            placeholder="Find user"
            value={input}
            onSearch={onSearch}
            onSelect={onSelect}
            onChange={v=> setInput(v)}
          />
        </div>
      }
    </Modal>
  )
});
