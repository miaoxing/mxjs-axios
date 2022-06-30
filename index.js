import axios from 'axios';
import $ from 'miaoxing';

const NOT_FOUND = 404;
const UNAUTHORIZED_CODE = 401;
const TIPS_DELAY = 3000;

function showError(error) {
  if (error.config && error.config.ignoreError) {
    return;
  }

  $.err(error.response.status === NOT_FOUND ? '很抱歉，您访问的页面不存在，请检查后再试' : '很抱歉，请求出错，请稍后再试');
}

axios.interceptors.request.use(config => {
  config.loading && $.loading('show');

  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token');
  }

  return config;
});

axios.interceptors.response.use(response => {
  // 未登录,跳转到登录地址
  if (typeof response.data.code !== 'undefined' && response.data.code === UNAUTHORIZED_CODE) {
    setTimeout(function () {
      window.location.href = $.fullUrl(response.data.next);
    }, TIPS_DELAY);
  }

  $.loading('hide');
  return response;
}, error => {
  $.loading('hide');
  showError(error);
  return Promise.reject(error);
});

export default axios;
