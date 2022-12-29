import axios from 'axios';
import $ from 'miaoxing';

const NOT_FOUND = 404;

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
  $.loading('hide');
  return response;
}, error => {
  $.loading('hide');
  showError(error);
  return Promise.reject(error);
});

export default axios;
