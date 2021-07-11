import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import PublicRoute from './public';
import PrivateRoute from './private';

import { Login, Register } from 'pages/public';
import { Home } from 'pages/private';

function Routers () {
  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/register" component={Register} />

        <PrivateRoute exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default Routers;
