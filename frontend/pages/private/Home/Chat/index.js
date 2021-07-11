import React, { useEffect, useState } from 'react';
import { Col, Button, Row, Avatar, Typography } from 'antd';
import { PhoneFilled, SendOutlined } from '@ant-design/icons';
import { axios } from 'helpers';
import s from './index.scss';

export default function Chat ({ userId }) {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  useEffect(()=> {
    (async ()=> {
      const res = await axios.get(`users/${userId}`);
      setUser(res.data);
    })()
  }, [userId]);

  return (
    <Col className={s.chat}>
      <Row className={s.header}>
        <Row>
          <Avatar size={48} />
          <Col className={s.descUser}>
            <Typography.Text strong={true}>{user.login}</Typography.Text>
            <Typography.Text type="secondary">last visit 4 minutes ago</Typography.Text>
          </Col>
        </Row>

        <Col>
          <PhoneFilled className={s.iconPhone} />
        </Col>
      </Row>

      <Col className={s.wrapper}>
        <Col>{`Приветствую.
        Нужно сделать аватарку канала.
        Связанную строением мозга, эволюцией от обезьяны , генном человека, гормоны.
        На усмотрение дизайнера можно добавить или убрать что либо.
        Если ли здесь дизайнеры? Напишите в личные сообщения.`}</Col>
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
}
