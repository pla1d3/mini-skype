import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { Layout } from 'components';
import { observer, axios } from 'helpers';
import { useSocket } from 'helpers/hooks';
import s from '../index.scss';

const { Content } = Layout;

const PublicRoute = observer(({
  exact,
  path,
  component
})=> {
  const location = useLocation();
  const user = useSocket('user');

  useEffect(()=> {
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  useEffect(()=> {
    (async ()=> {
      try {
        const res = await axios.get('/get-me');
        user.set(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
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
