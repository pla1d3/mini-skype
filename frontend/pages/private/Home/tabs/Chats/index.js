import React, { useState, useEffect } from 'react';
import { Row, Avatar, Col, Typography } from 'components';
import { useSocket } from 'helpers/hooks';
import { c, observer, axios } from 'helpers';
import s from './index.scss';

const PrivateChat = observer(({ isActive, value, onClick })=> {
  const user = useSocket('user');
  const toUser = value.users.find(u=> u._id !== user.data._id);

  // chat.lastMessage

  return (
    <Row
      className={c(s.chat, { [s.chatActive]: isActive })}
      onClick={onClick}
    >
      <Avatar src={toUser._id} size={48} />
      <Col className={s.chatCase}>
        <Typography.Text strong={true}>{toUser.login}</Typography.Text>
        <Typography.Text>lastMessage</Typography.Text>
      </Col>
    </Row>
  );
});

export default observer(function Chats({ value, onSelect }) {
  const user = useSocket('user');
  const [chats, setChats] = useState([]);

  useEffect(()=> {
    (async ()=> {
      const chats = await axios.get('chats', {
        params: { userIds: [user.data._id] }
      });
      setChats(chats.data);
    })();
  }, []);

  return (
    <Col className={s.chats}>
      {
        chats.map(item=> (
          <PrivateChat
            key={item._id}
            value={item}
            isActive={value?._id === item._id}
            onClick={()=> onSelect(item)}
          />
        ))
      }
    </Col>
  );
});
