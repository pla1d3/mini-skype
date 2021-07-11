import React, { useEffect, useState } from 'react';
import { Avatar, Row, Col, Typography, Button } from 'antd';
import { c, axios } from 'helpers';
import { observer } from 'mobx-react-lite';
import { useStore } from 'helpers/hooks';
import AddContact from './AddContact';
import s from './index.scss';

export default observer(function Contacts ({
  selectedUserId,
  onChangeSelectedUserId
}) {
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
          user.data.contacts.map(user => (
            <Row
              className={c([s.row, { [s.rowActive]: selectedUserId === user._id }])}
              onClick={()=> onChangeSelectedUserId(user._id)}
            >
              <Avatar size={48} />
              <Col className={s.desc}>
                <Typography.Text strong={true}>{user.login}</Typography.Text>
                <Typography.Text type="secondary">last visit 4 minutes ago</Typography.Text>
              </Col>
            </Row>
          ))
        }
      </Col>

      <AddContact
        visible={modalVisible}
        onChange={v=> setModalVisible(v)}
      />
    </>
  )
})
