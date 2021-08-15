import React, { useState } from 'react';
import { AutoComplete, Alert, Modal } from 'components';
import { observer, axios } from 'helpers';
import { useSocket } from 'helpers/hooks';
import s from './index.scss';

export default observer(function AddContactModal({ visible, onChange }) {
  const user = useSocket('user');
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [selectUserId, setSelectUserId] = useState('');

  async function onSearch(login) {
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

  function onSelect(value) {
    setInput('');
    setSelectUserId(value);
  }

  async function onModalOk() {
    if (selectUserId) {
      await axios.post('users/contacts/add', {
        contactId: selectUserId,
        userId: user.data._id
      });
    }

    onChange(false);
  }

  function onAlertClose() {
    setSelectUserId('');
    setUsers([]);
  }

  const selectUser = users.find(u=> u._id === selectUserId);

  return (
    <Modal
      title="Add contact"
      width={320}
      visible={visible}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={onModalOk}
      onCancel={()=> onChange(false)}
      okText={selectUserId ? 'Add' : 'Ok'}
    >
      {
        !!selectUserId &&
        <Alert
          closable={true}
          className={s.tagUser}
          message={selectUser.login}
          onClose={onAlertClose}
        />
      }

      {
        !selectUserId &&
        <div className={s.inputWrapper}>
          <AutoComplete
            options={users.map(u=> ({ label: u.login, value: u._id }))}
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
  );
});
