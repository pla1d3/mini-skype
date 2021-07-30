import React, { useState } from 'react';
import { Tabs, Col } from 'antd';
import { useStore } from 'helpers/hooks';
import { axios } from 'helpers';
import { observer } from 'mobx-react-lite';
import Contacts from './Contacts';
import Chat from './Chat';
import s from './index.scss';

export default observer(function Home () {
  const user = useStore('user')
  const [slide, setSlide] = useState('contacts');
  const [selectUserId, setSelectUserId] = useState('');
  const [chatId, setChatId] = useState('');

  async function onContactSelect (userId) {
    setSelectUserId(userId)
    setChatId(user.data._id + '__' + userId)
  }

  function onChangeTab (value) {
    setSlide(value);
  }

  return (
    <div className={s.row}>
      <Col>
        <Tabs
          className={s.tabs}
          activeKey={slide}
          centered={true}
          tabBarGutter={0}
          onChange={onChangeTab}
        >
          <Tabs.TabPane
            key="contacts"
            tab={<div className={s.tab}>Contacts</div>}
          >
            <Contacts
              value={selectUserId}
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
          !selectUserId &&
          <Col className={s.welcome}>Welcome! /username/</Col>
        }

        {
          !!selectUserId &&
          <Chat chatId={chatId} />
        }
      </Col>
    </div>
  );
})
