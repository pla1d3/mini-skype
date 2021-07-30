import React, { useEffect, useState } from 'react';
import { Col, Button, Row, Avatar, Typography } from 'antd';
import { PhoneFilled, SendOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { axios } from 'helpers';
import s from './index.scss';

export default observer(function Chat ({ chatId }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState({});

  useEffect(()=> {
    (async ()=> {
      const res = await axios.get(`chats/${chatId}`);
      setChat(res.data);
    })()
  }, [chatId]);

  return (
    <Col className={s.chat}>
      <Row className={s.header}>
        <Row>
          <Avatar size={48} />
          <Col className={s.descUser}>
            <Typography.Text strong={true}>
              {chat.type === 'private' ? chat.users[0].login : chat.title}
            </Typography.Text>
            <Typography.Text type="secondary">last visit 4 minutes ago</Typography.Text>
          </Col>
        </Row>

        <Col>
          <PhoneFilled className={s.iconPhone} />
        </Col>
      </Row>

      <Col className={s.wrapper}>
        <Col>{`message`}</Col>
      </Col>

      <Row className={s.inputWrapper}>
        <input
          className={s.inputMessage}
          value={message}
          onChange={e=> setMessage(e.target.value)}
        />
        <Button
          className={s.send}
          icon={<SendOutlined />}
        />
      </Row>
    </Col>
  )
})
