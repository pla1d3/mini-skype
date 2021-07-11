export const popupWindow = (url, title, w, h)=> {
  const left = (screen.width / 2) - (w / 2);
  const top = (screen.height / 2) - (h / 2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
};

export const isMobile = ()=> {
  const userAgent = navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i);
  return !!userAgent;
};

export const validate = (formSchema, data, options)=> {
  const valid = formSchema.validate(data, { abortEarly: false, ...options });

  if (valid.error) {
    return valid.error.details.reduce((acc, item)=> {
      acc[item.path[0]] = item.message;
      return acc;
    }, {});
  } else {
    return null;
  }
};

export const randomString = length=> {
  let res = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return res;
};

export const parseLink = {
  inst: (link, type)=> {
    if (type === 'follow') {
      const isLink = link.indexOf('instagram.com') !== -1;
      if (isLink) return link.split('/')[3];
      if (link[0] === '@') return link.slice(1);
      return link;
    } else {
      return link.split('/')[4];
    }
  },
  vk: (link, type)=> {
    const infoArr = [];

    if (type === 'follow') {
      infoArr[1] = link.split('/')[3].replace(/^id/gi, '');
    } else {
      link.match(/((\bwall|\bphoto|\bvideo|\btopic)(\-*)(\d+)_(\d+))|(club|public|group|board|albums|sel=[c]*)(\-*)(\d+)|(\bfriends\b|\bgroups\b|\bfave\b|\bphotos\b|\bvideos\b|\bim\b(?!\?))/).forEach(item=> {
        if (!!item && !!Number(item)) {
          if (infoArr[1]) infoArr[1] += (infoArr[1] === '-' ? '' : '_') + item;
          else infoArr[1] = item;
        }

        if (!!item && /^[a-zA-Z]+$/.test(item)) infoArr[0] = item;
        if (item === '-') infoArr[1] = '-' + (infoArr[1] || '');
      });
    }

    return infoArr;
  }
};

export const toLatin = word=> {
  const alphabet = {
    'Ё': 'YO', 'Й': 'I', 'Ц': 'TS', 'У': 'U',
    'К': 'K', 'Е': 'E', 'Н': 'N', 'Г': 'G', 'Ш': 'SH',
    'Щ': 'SCH', 'З': 'Z', 'Х': 'H', 'Ъ': '\'', 'ё': 'yo',
    'й': 'i', 'ц': 'ts', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n',
    'г': 'g', 'ш': 'sh', 'щ': 'sch', 'з': 'z', 'х': 'h', 'ъ': '\'',
    'Ф': 'F', 'Ы': 'I', 'В': 'V', 'А': 'a', 'П': 'P', 'Р': 'R', 'О': 'O',
    'Л': 'L', 'Д': 'D', 'Ж': 'ZH', 'Э': 'E', 'ф': 'f', 'ы': 'i', 'в': 'v',
    'а': 'a', 'п': 'p', 'р': 'r', 'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh',
    'э': 'e', 'Я': 'Ya', 'Ч': 'CH', 'С': 'S', 'М': 'M', 'И': 'I', 'Т': 'T',
    'Ь': '\'', 'Б': 'B', 'Ю': 'YU', 'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm',
    'и': 'i', 'т': 't', 'ь': '\'', 'б': 'b', 'ю': 'yu'
  };
  return word.split('').map(char=> alphabet[char] || char).join('');
};

export const getNumOfPer = (num, per)=> num * (per / 100) || 0;
export const getPerOfNum = (num, full)=> (num / full) * 100 || 0;
