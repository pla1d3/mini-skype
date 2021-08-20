import React, { useState } from 'react';
import { Row, Col, Typography, Button, Avatar } from 'components';
import { useStore } from 'helpers/hooks';
import { observer, c } from 'helpers';
import AddContactModal from './AddContactModal';
import s from './index.scss';

export default observer(function Contacts({ value, onSelect }) {
  const user = useStore('user');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button
        className={s.add}
        onClick={()=> setModalVisible(true)}
      >Add contact</Button>

      <Col className={s.contacts}>
        {
          user.data.contacts.map(user=> (
            <Row
              key={user._id}
              className={c([s.row, { [s.rowActive]: value?._id === user._id }])}
              onClick={()=> onSelect(user)}
            >
              <Avatar src={user._id} size={48} />
              <Col className={s.desc}>
                <Typography.Text strong={true}>{user.login}</Typography.Text>
                <Typography.Text type="secondary">last visit 4 minutes ago</Typography.Text>
              </Col>
            </Row>
          ))
        }
      </Col>

      <AddContactModal
        visible={modalVisible}
        onChange={v=> setModalVisible(v)}
      />
    </>
  );
});
