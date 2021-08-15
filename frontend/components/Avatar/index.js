import React from 'react';
import { Avatar } from 'antd';
import { AvatarGenerator } from 'random-avatar-generator';

const generator = new AvatarGenerator();

export default ({ src, ...props })=> {
  return <Avatar
    src={generator.generateRandomAvatar(src)}
    {...props}
  />;
};
