import { Notification } from 'element-ui';
import { create as axios } from 'axios';
import router from '../plugins/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',

  3101: 'session过期',
  3102: '页面无权限',
};

// 网络校验
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  Notification.error({
    title: `请求错误: ${response.url}`,
    message: `${response.status}: ${errortext}`,
    showClose: false,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

// 请求返回内容的返回码校验
const checkCodeNum = ({ data }) => {
  const { codeNum, codeDesc, value, success } = data;

  // 用户 session 过期
  if (
    codeNum === 3101 &&
    (localStorage.getItem('Redireced') === 'undefined' ||
      localStorage.getItem('Redireced') === 'false')
  ) {
    localStorage.setItem('Redireced', 'true'); // 防止多次重定向

    window.location.href = `${value.redirectUrl}&redirectUrl=${
      window.location.href.split('?')[0]
    }?redirect=true`;
  }

  // 页面无权限
  if (codeNum === 3102) {
    router.push('/401');
  }

  // 业务处理失败 && 非 session 过期
  if (!success && !codeMessage[codeNum]) {
    Notification.error({
      title: `系统提醒: ${codeNum}`,
      message: codeDesc,
      showClose: false,
    });
  }
  return data;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // 根据运行环境切换 api 接口
  const requestURL = url
      .replace('/api', process.env.baseUrl)
      .replace('/dvm', '');

  const defaultOptions = {
    credentials: 'include',
    headers: {
      TOKEN: localStorage.getItem('token'),
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'PATCH'
  ) {
    if (!(newOptions.data instanceof FormData)) {
      newOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.data = JSON.stringify(newOptions.data);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  // 文件自动下载
  if (newOptions.headers['Content-Type'] === 'application/msexcel') {
    if (requestURL.includes('token')) {
      window.open(`${requestURL}`, '_self');
    } else {
      window.open(
          `${requestURL}?token=${localStorage.getItem('token')}`,
          '_self'
      );
    }
    return {};
  }
  return axios(requestURL, newOptions)
      .then(checkStatus)
      .then(checkCodeNum)
      .catch((e) => {
        console.error(e);
      // const status = e.name;
      // if (status === 401) {
      //   // @HACK
      //   /* eslint-disable no-underscore-dangle */
      //   window.g_app._store.dispatch({
      //     type: 'login/logout',
      //   });
      //   return;
      // }
      // environment should not be used
      // if (status === 403) {
      //   router.push('/exception/403');
      //   return;
      // }
      // if (status <= 504 && status >= 500) {
      //   router.push('/exception/500');
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   router.push('/exception/404');
      // }
      });
}
