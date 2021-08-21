import React, { useEffect, useState } from 'react';
import { Avatar, Col, Button, Row, Typography, Markdown } from 'components';
import { PhoneFilled, SendOutlined } from '@ant-design/icons';
import { useStore, useSocket } from 'helpers/hooks';
import { axios, observer, c, dayjs } from 'helpers';
import s from './index.scss';

import Call from './Call';

const Chat = observer(({
  chat,
  messages,
  peerConnection,
  onSend
})=> {
  const user = useStore('user');
  const [message, setMessage] = useState('');

  function _onSend() {
    onSend(message);
    setMessage('');
  }

  async function onCall() {
    chat.callIds.push(user.data._id);
    await axios.post(`chats/${chat._id}/edit`, {
      callIds: chat.callIds
    });
  }

  return (
    <Col className={s.chat}>
      {
        chat?.callIds?.find(userId=> userId === user.data._id) &&
        <Call
          toUser={chat.toUser}
          peerConnection={peerConnection}
        />
      }
      <Row className={s.header}>
        <Row>
          <Avatar src={chat.avatarUrl} size={48} />
          <Col className={s.descUser}>
            <Typography.Text strong={true}>{chat.title}</Typography.Text>
            <Typography.Text type="secondary">{chat.description}</Typography.Text>
          </Col>
        </Row>

        <Col
          className={s.phone}
          onClick={onCall}
        >
          <PhoneFilled className={s.iconPhone} />
        </Col>
      </Row>

      <Col className={s.wrapper}>
        {
          messages.data?.reverse().map(message=> (
            <Row
              key={message._id}
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
                <Markdown className={s.messageText}>
                  {message.text}
                </Markdown>
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

const SocketChat = observer(({ chat, peerConnection, onSend })=> {
  const messages = useSocket('messages', { chatId: chat._id });
  return <Chat
    messages={messages}
    peerConnection={peerConnection}
    chat={chat}
    onSend={onSend}
  />;
});

export default observer(function ChatContainer({
  chat,
  peerConnection,
  onSend
}) {
  const user = useStore('user');

  useEffect(()=> {
    (async ()=> {
      const unreadIndex = chat.unreadIds.findIndex(userId=> userId === user.data._id);
      if (unreadIndex !== -1) {
        chat.unreadIds.splice(unreadIndex, 1);
        await axios.post(`chats/${chat._id}/edit`, chat);
      }
    })();
  }, [JSON.stringify(chat)]);

  if (chat.type === 'private') {
    const _chat = { ...chat };
    const toUser = chat.users.find(u=> u._id !== user.data._id);
    _chat.toUser = toUser;
    _chat.title = toUser.login;
    _chat.avatarUrl = toUser._id;
    _chat.description = 'last visit 4 minutes ago';

    if (chat._id === 'draft') {
      return <Chat
        messages={[]}
        chat={_chat}
        peerConnection={peerConnection}
        onSend={onSend}
      />;
    }

    return <SocketChat
      chat={_chat}
      peerConnection={peerConnection}
      onSend={onSend}
    />;
  }
});
