import React from 'react';
import { c } from 'helpers';
import s from './index.scss';

export default ({
  className,
  children,
  err
})=> {
  return (
    <div className={c(className, { [s.errCase]: !!err })}>
      {children}
      {err && <div className={s.err}>{err}</div>}
    </div>
  );
};
