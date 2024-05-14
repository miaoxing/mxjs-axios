import axios from 'axios';
import $ from 'miaoxing';

const NOT_FOUND = 404;

function showError(error) {
  if (error.config && error.config.ignoreError) {
    return;
  }

  $.err(error.response.status === NOT_FOUND ? '很抱歉，您访问的页面不存在，请检查后再试' : '很抱歉，请求出错，请稍后再试');
}

const showLoading = (config) => {
  config.loading && $.loading('show');
  config.onLoadingChange?.(true);
};

const hideLoading = (config) => {
  config.loading && $.loading('hide');
  config.onLoadingChange?.(false);
};

axios.interceptors.request.use(config => {
  showLoading(config);

  // @experimental 考虑改为环境变量
  // 如果是相对地址，转换为 api 地址
  if (!config.url.startsWith('/') && !config.url.startsWith('http')) {
    config.url = $.apiUrl(config.url);
  }

  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token');
  }

  return config;
});

axios.interceptors.response.use(response => {
  hideLoading(response.config);
  return response;
}, error => {
  hideLoading(error.config);
  showError(error);
  return Promise.reject(error);
});

export default axios;
