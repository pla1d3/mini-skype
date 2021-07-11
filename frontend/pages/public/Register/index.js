import React, { useState } from 'react';
import {
  Input,
  Button,
  Space,
  Row,
  Col,
  Divider,
  Card,
  Typography
} from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { ErrorWrapper } from 'components';
import { useHistory } from 'react-router-dom';
import { axios } from 'helpers';
import { useData, useError, useStore } from 'helpers/hooks';
import formSchema from './utils/joi';
import s from './index.scss';

export default function Register () {
  const history = useHistory();
  const user = useStore('user');
  const [data] = useData({ login: '', email: '', password: '' })
  const [err] = useError();

  const onSubmit = async ()=> {
    if (err.check(formSchema, data)) return;

    const res = await axios.post('/reg', data);
    if (!res.data.error) {
      user.set(res.data);
      history.push('/dashboard');
      return;
    }

    err.setValue('server', res.data.error);
  };

  return (
    <Row justify="center" align="center">
      <Col>
        <Card className={s.card}>
          <Typography.Title className={s.caption} level={2}>Регистрация</Typography.Title>
          <Space className={s.space} direction="vertical">
            <ErrorWrapper err={err.login}>
              <Input
                placeholder="Логин"
                value={data.login}
                onChange={e=> data.setValue('login', e.target.value)}
              />
            </ErrorWrapper>

            <ErrorWrapper err={err.email}>
              <Input
                placeholder="E-mail"
                value={data.email}
                onChange={e=> data.setValue('email', e.target.value)}
              />
            </ErrorWrapper>

            <ErrorWrapper err={err.email}>
              <Input.Password
                placeholder="Пароль"
                value={data.password}
                onChange={e=> data.setValue('password', e.target.value)}
              />
            </ErrorWrapper>

            <Button
              block
              type="primary"
              onClick={onSubmit}
            >Продолжить</Button>
          </Space>

          <Divider>или</Divider>

          <Space className={s.space} direction="vertical">
            <Button block className={s.authLink} icon={<GoogleOutlined />}>
              Войти с помощью Google
            </Button>
            <Button block className={s.authLink} icon={<FacebookOutlined />}>
              Войти с помощью Facebook
            </Button>
          </Space>
        </Card>

        <Col align="center" className={s.switch}>
          <Typography.Paragraph>Уже зарегистрированы?</Typography.Paragraph>
          <Button onClick={()=> history.push('/login')}>Войти</Button>
        </Col>
      </Col>
    </Row>
  )
}
