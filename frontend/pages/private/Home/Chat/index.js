import React, { useState } from 'react';
import { Avatar, Col, Button, Row, Typography } from 'components';
import { PhoneFilled, SendOutlined } from '@ant-design/icons';
import { useSocket } from 'helpers/hooks';
import { observer, c, dayjs } from 'helpers';
import s from './index.scss';

export default observer(function Chat({ chat, onSend }) {
  const user = useSocket('user');
  const messages = useSocket('messages', { chatId: chat._id });
  const [message, setMessage] = useState('');

  if (chat.type === 'private') {
    const toUser = chat.users.find(u=> u._id !== user.data._id);
    chat.title = toUser.login;
    chat.avatarUrl = toUser._id;
    chat.description = 'last visit 4 minutes ago';
  }

  function _onSend() {
    setMessage('');
    onSend(message);
  }

  return (
    <Col className={s.chat}>
      <Row className={s.header}>
        <Row>
          <Avatar src={chat.avatarUrl} size={48} />
          <Col className={s.descUser}>
            <Typography.Text strong={true}>{chat.title}</Typography.Text>
            <Typography.Text type="secondary">{chat.description}</Typography.Text>
          </Col>
        </Row>

        <Col>
          <PhoneFilled className={s.iconPhone} />
        </Col>
      </Row>

      <Col className={s.wrapper}>
        {
          messages.data?.map(message=> (
            <Row
              className={c(s.messageCase, {
                [s.messageCaseRight]: message.user._id !== user.data._id
              })}
            >
              <Avatar src={message.user._id} size='large' />
              <Col className={s.messageContent}>
                <Row>
                  <Col>{message.user.login}</Col>
                  <Col className={s.messageTime}>
                    {dayjs(message.createdAt).format('DD.MM.YYYY HH:mm')}
                  </Col>
                </Row>
                <Col className={s.messageText}>{message.text}</Col>
              </Col>
            </Row>
          ))
        }
      </Col>

      <Row className={s.inputWrapper}>
        <input
          className={s.inputMessage}
          value={message}
          placeholder="Write new message..."
          onChange={e=> setMessage(e.target.value)}
        />
        <Button
          className={s.send}
          icon={<SendOutlined />}
          onClick={_onSend}
        />
      </Row>
    </Col>
  );
});
