import React, { useState } from 'react';
import { Tabs, Col, Typography } from 'components';
import { observer, axios } from 'helpers';
import { useSocket } from 'helpers/hooks';
import Contacts from './Contacts';
import Chat from './Chat';
import s from './index.scss';

export default observer(function Home() {
  const user = useSocket('user');
  const [slide, setSlide] = useState('contacts');
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectChat, setSelectChat] = useState(null);

  async function onSelectUser(userId) {
    setSelectUserId(userId);

    const resChat = await axios.get('chat', {
      params: {
        userIds: [user.data._id, userId],
        type: 'private'
      }
    });

    if (resChat.data) return setSelectChat(resChat.data);
    setSelectChat({
      _id: 'draft',
      type: 'private'
    });
  }

  // async function onSelectChat (chatId) {}

  async function onSendMessage(text) {
    if (selectChat._id === 'draft') {
      const resChat = await axios.post('chats/create', {
        userIds: [user.data._id, selectUser._id],
        type: 'private'
      });
      setSelectChat(resChat.data);
    }

    await axios.post('messages/create', {
      userId: user.data._id,
      chatId: selectChat._id,
      text
    });
  }

  return (
    <div className={s.row}>
      <Col>
        <Tabs
          className={s.tabs}
          activeKey={slide}
          centered={true}
          tabBarGutter={0}
          onChange={v=> setSlide(v)}
        >
          <Tabs.TabPane
            key="contacts"
            tab={<div className={s.tab}>Contacts</div>}
          >
            <Contacts
              value={selectUserId}
              onSelect={v=> onSelectUser(v)}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="chats"
            tab={<div className={s.tab}>Chats</div>}
          >
            Chats
          </Tabs.TabPane>

          <Tabs.TabPane
            key="settings"
            tab={<div className={s.tab}>Settings</div>}
          >
            Settings
          </Tabs.TabPane>
        </Tabs>
      </Col>

      <Col className={s.content}>
        {
          !selectChat &&
          <Col className={s.welcome}>
            <Col className={s.welcomeCase}>
              <Typography.Text className={s.welcomeText}>Welcome! {user.data.login}</Typography.Text>
              <Typography.Text className={s.welcomeText}>Select a chat to start messaging</Typography.Text>
            </Col>
          </Col>
        }

        {
          !!selectChat &&
          <Chat
            chat={selectChat}
            onSend={onSendMessage}
          />
        }
      </Col>
    </div>
  );
});
