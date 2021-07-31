import React, { useState } from 'react';
import { Tabs, Col, Typography } from 'antd';
import { useStore, useSocket } from 'helpers/hooks';
import { axios } from 'helpers';
import { observer } from 'mobx-react-lite';
import Contacts from './Contacts';
import Chat from './Chat';
import s from './index.scss';

export default observer(function Home () {
  const user = useStore('user');
  // const chats = useSocket('chats', {});

  const [slide, setSlide] = useState('contacts');
  const [selectUser, setSelectUser] = useState(null);
  const [selectChat, setSelectChat] = useState(null);
  const [messages, setMessages] = useState([]);

  async function onContactSelect (userId) {
    // fromUserId, toUserId
    const resChat = await axios.get('chat', {
      params: {
        userIds: [user.data._id, userId],
        fromId: user.data._id,
        type: 'private'
      },
    });
    setSelectChat(resChat.data);

    if (resChat) {
      const resMessages = await axios.get('messages', {
        params: { chatId: resChat.data._id }
      });
      setMessages(resMessages.data);
    }

    const resUser = await axios.get(`users/${userId}`);
    setSelectUser(resUser.data);
  }

  async function onChatSelect () {}

  async function onSendFromUser (text) {
    const resChat = await axios.post('chats/create', {
      userIds: [user.data._id, selectUser._id],
      type: 'private'
    })

    await axios.post('messages/create', {
      userId: user.data._id,
      chatId: resChat.data,
      text
    })
  }

  async function onSendFromChat (text) {}

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
              value={selectUser?._id}
              onSelect={v=> onContactSelect(v)}
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
          !selectUser &&
          <Col className={s.welcome}>
            <Col className={s.welcomeCase}>
              <Typography.Text className={s.welcomeText}>Welcome! {user.data.login}</Typography.Text>
              <Typography.Text className={s.welcomeText}>Select a chat to start messaging</Typography.Text>
            </Col>
          </Col>
        }

        {
          !!selectUser && !selectChat &&
          <Chat
            title={selectUser.login}
            description='last visit 4 minutes ago'
            messages={messages}
            onSend={onSendFromUser}
          />
        }

        {
          !!selectChat &&
          <Chat
            title={
              selectChat.type === 'private'
                ? selectChat.toUser.login
                : selectChat.title
            }
            description={
              selectChat.type === 'private'
                ? 'last visit 4 minutes ago'
                : 'users'
            }
            messages={messages}
          />
        }
      </Col>
    </div>
  );
})
