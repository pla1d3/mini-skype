import React, { useState } from 'react';
import { Col, Button, Row, Avatar, Typography } from 'antd';
import { PhoneFilled, SendOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import s from './index.scss';

export default observer(function Chat ({
  title,
  description,
  messages,
  onSend
}) {
  const [message, setMessage] = useState('');

  function _onSend () {
    onSend(message)
    setMessage('')
  }

  console.log(messages)

  return (
    <Col className={s.chat}>
      <Row className={s.header}>
        <Row>
          <Avatar size={48} />
          <Col className={s.descUser}>
            <Typography.Text strong={true}>{title}</Typography.Text>
            <Typography.Text type="secondary">{description}</Typography.Text>
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
          onClick={_onSend}
        />
      </Row>
    </Col>
  )
})
