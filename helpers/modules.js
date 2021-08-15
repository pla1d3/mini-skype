import config from 'config';

export { default as c } from 'clsx';

import _qs from 'query-string';
export const qs = {
  parse: (value)=> {
    return _qs.parse(value, {
      skipEmptyString: true,
      skipNull: true
    });
  },
  stringify: (value)=> {
    return _qs.stringify(value, {
      skipEmptyString: true,
      skipNull: true
    });
  }
};

import _dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

_dayjs.extend(customParseFormat);
_dayjs.extend(localizedFormat);
_dayjs.locale('ru');
_dayjs.extend(utc);
export const dayjs = _dayjs;

import _axios from 'axios';
export const axios = _axios.create({
  baseURL: config.apiUrl + 'v1',
  withCredentials: true
});

export { observer } from 'mobx-react-lite';
