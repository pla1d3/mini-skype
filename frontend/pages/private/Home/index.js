import React, { useState } from 'react';
import { Tabs, Col, Typography } from 'components';
import { observer, axios } from 'helpers';
import { useSocket } from 'helpers/hooks';
import { Contacts, Chats } from './tabs';
import Chat from './Chat';
import s from './index.scss';

export default observer(function Home() {
  const user = useSocket('user');
  const [slide, setSlide] = useState('chats');
  const [selectUser, setSelectUser] = useState(null);
  const [selectChat, setSelectChat] = useState(null);

  async function onSelectUser(selectUser) {
    setSelectUser(selectUser);

    /*
      const [chat] = await api.chats.get({
        params: {
          userIds: [user.data._id, selectUser._id],
          type: 'private'
        }
      })
    */
    const chats = await axios.get('chats', {
      params: {
        userIds: [user.data._id, selectUser._id],
        type: 'private'
      }
    });

    if (chats.data.length) return setSelectChat(chats.data[0]);
    setSelectChat({
      _id: 'draft',
      type: 'private',
      users: [user.data, selectUser]
    });
  }

  async function onSendMessage(text) {
    let _selectChat = selectChat;

    if (selectChat._id === 'draft') {
      /*
        const chatId = await api.chats.create({
          userIds: [user.data._id, selectUser._id],
          type: 'private'
        })
      */
      const newChat = await axios.post('chats/create', {
        userIds: [user.data._id, selectUser._id],
        type: 'private'
      });

      const chat = await axios.get(`chats/${newChat.data}`);
      _selectChat = chat.data;
      setSelectChat(_selectChat);
    }

    await axios.post('messages/create', {
      userId: user.data._id,
      chatId: _selectChat._id,
      text
    });
  }

  function onChangeSlide(slide) {
    setSelectUser(null);
    setSlide(slide);
  }

  return (
    <div className={s.row}>
      <Col>
        <Tabs
          className={s.tabs}
          activeKey={slide}
          centered={true}
          tabBarGutter={0}
          onChange={onChangeSlide}
        >
          <Tabs.TabPane
            key="contacts"
            tab={<div className={s.tab}>Contacts</div>}
          >
            <Contacts
              value={selectUser}
              onSelect={onSelectUser}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="chats"
            tab={<div className={s.tab}>Chats</div>}
          >
            <Chats
              value={selectChat}
              onSelect={setSelectChat}
            />
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
