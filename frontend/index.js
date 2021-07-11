import React from 'react';
import { hydrate, render } from 'react-dom';
import Routers from './routers';
import 'antd/dist/antd.dark.css';
import './index.scss';

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(<Routers/>, rootElement);
} else {
  render(<Routers/>, rootElement);
}
