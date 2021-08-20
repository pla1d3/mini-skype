import React from 'react';
import { Row, Avatar, Col, Typography } from 'components';
import { useStore } from 'helpers/hooks';
import { c, observer } from 'helpers';
import s from './index.scss';

const PrivateChat = observer(({ isActive, value, onClick })=> {
  const user = useStore('user');
  const toUser = value.users.find(u=> u._id !== user.data._id);
  const isUnread = value.unreadIds?.find(userId=> userId === user.data._id);

  return (
    <Row
      className={c(s.chat, { [s.chatActive]: isActive })}
      onClick={onClick}
    >
      <Avatar src={toUser._id} size={48} />
      <Col className={s.chatCase}>
        <Typography.Text strong={true}>{toUser.login}</Typography.Text>
        <Typography.Text type="secondary">{value.lastMessage.text}</Typography.Text>
        {isUnread && <div className={s.newMessages}>New messages</div>}
      </Col>
    </Row>
  );
});

export default function Chats({ chats, value, onSelect }) {
  return (
    <Col className={s.chats}>
      {
        chats?.map(item=> (
          <PrivateChat
            key={item._id}
            value={item}
            isActive={value === item._id}
            onClick={()=> onSelect(item._id)}
          />
        ))
      }
    </Col>
  );
}
