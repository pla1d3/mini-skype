import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { Layout } from 'components';
import { observer, axios } from 'helpers';
import { useStore } from 'helpers/hooks';
import s from '../index.scss';

const { Content } = Layout;

const PublicRoute = observer(({
  exact,
  path,
  component
})=> {
  const location = useLocation();
  const user = useStore('user');

  useEffect(()=> {
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  useEffect(()=> {
    axios.get('/get-me')
      .then(res=> user.set(res.data))
      .catch(()=> user.set(false));
  }, []);

  if (user.data === null) return null;
  return (
    <Layout className={s.publicLayout}>
      <Content className={s.publicMain}>
        <Route exact={exact} path={path} component={component} />
      </Content>
    </Layout>
  );
});

export default PublicRoute;
