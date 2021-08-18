import React from 'react';
import { Col } from 'antd';
import ReactMarkdown from 'react-markdown';
import s from './index.scss';

export default function Markdown({ className, children }) {
  return (
    <Col className={className}>
      <ReactMarkdown
        components={{
          p({ children }) {
            return <p className={s.p}>{children}</p>;
          }
        }}
      >{children}</ReactMarkdown>
    </Col>
  );
}
