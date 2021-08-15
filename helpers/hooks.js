import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { validate, qs, axios } from 'helpers';
import { getStore, getSocket } from '../frontend/store';

export function useStore(storeName) {
  return getStore(storeName);
};

export function useSocket(storeName, params) {
  return getSocket(storeName, params);
};

export function useData(init = {}) {
  const [data, setData] = useState(init);

  function Data(data) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  Data.prototype.setValue = (key, value)=> {
    setData({ ...data, [key]: value });
  };

  Data.prototype.toggleArr = (key, value)=> {
    const index = data[key].indexOf(value);
    if (index !== -1) data[key].splice(index, 1);
    else data[key].push(value);
    setData({ ...data });
  };

  return [new Data(data), setData];
};

export function useError(data = {}) {
  const [err, setErr] = useState(data);

  function Err(err) {
    for (const key in err) {
      this[key] = err[key];
    }
  }

  Err.prototype.setValue = (key, value)=> {
    setErr({ ...this, [key]: value });
  };

  Err.prototype.check = (formSchema, data, options)=> {
    setErr({});
    const errValid = validate(formSchema, data, options);
    if (errValid) {
      setErr(errValid);
      return errValid;
    }
  };

  return [new Err(err), setErr];
};

export function useSearch() {
  const history = useHistory();
  const searchParse = useMemo(()=> qs.parse(history.location.search), [history.location.search]);
  const search = { ...searchParse };

  function Search(search) {
    for (const key in search) {
      this[key] = search[key];
    }
  }

  Search.prototype.toggleArr = ()=> {};

  Search.prototype.setValue = (key, value)=> {
    if (search[key] === value) return;
    search[key] = value;
    const pathname = history.location.pathname;
    history.push(pathname + '?' + qs.stringify(search));
  };

  Search.prototype.changePage = (pageId, newValue)=> {
    const pathname = history.location.pathname;
    const find = pathname.match(new RegExp(`/${pageId}`, 'gi'));
    const hasPageId = !!find?.length;

    let url = pathname;
    if (hasPageId) {
      url = pathname.replace(new RegExp(`/${pageId}`, 'gi'), `/${newValue}`);
    } else {
      if (url[url.length - 1] === '/') {
        url = pathname.replace(new RegExp('/$', 'gi'), `/${newValue}`);
      } else {
        url += `/${newValue}`;
      }
    }

    if (Object.keys(search)) url += '?' + qs.stringify(search);
    history.push(url);
  };

  return new Search(search);
};

export function usePathname(start = 2) {
  const { pathname } = useLocation();
  const [cutPathname, setCutPathname] = useState(getCutPathname());

  useEffect(()=> {
    setCutPathname(getCutPathname());
  }, [pathname]);

  function getCutPathname() {
    let tempPathname = pathname.split('/');
    tempPathname.splice(start, 1);
    tempPathname = tempPathname.join('/');
    return tempPathname;
  };

  return cutPathname;
};

export function useRefCallback(callback, isCallback) {
  const ref = useRef();

  const refCallback = useCallback(node=> {
    if (!ref.current) {
      callback(node);
      ref.current = node;
    }
  }, []);

  const resRef = useMemo(()=> isCallback ? refCallback : ref, [isCallback]);
  return resRef;
};

export function useFetch(apiUrl, fetchParams = {}, updateParams = []) {
  const [data, setData] = useState();

  useEffect(()=> {
    const fetch = async ()=> {
      const res = await axios(apiUrl, fetchParams);
      setData(res.data);
    };

    fetch();
  }, updateParams);

  return [data, setData];
}
