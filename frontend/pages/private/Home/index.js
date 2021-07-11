import React, { useState } from 'react';
import { Tabs, Col } from 'antd';
import Contacts from './Contacts';
import Chat from './Chat';
import s from './index.scss';

export default function Home () {
  const [slide, setSlide] = useState('contacts');
  const [selectedUserId, setSelecedtUserId] = useState('');

  function onChangeTab (value) {
    setSelecedtUserId('');
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
              selectedUserId={selectedUserId}
              onChangeSelectedUserId={v=> setSelecedtUserId(v)}
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
          !selectedUserId &&
          <Col className={s.welcome}>Welcome! /username/</Col>
        }

        {
          !!selectedUserId &&
          <Chat userId={selectedUserId} />
        }
      </Col>
    </div>
  );
};
