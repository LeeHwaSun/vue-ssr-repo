"use strict";

import Vue from 'vue';
import axios from "axios";
import VueCookies from 'vue-cookies';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.BASE_URL || process.env.apiUrl || "",
  timeout: 60 * 1000, // Timeout
  proxy : {
    host : 'localhost',
    port : process.env.VUE_APP_SERVER_PORT,
  }
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

// Request Interceptor
_axios.interceptors.request.use(
  function(config) {
    // 토큰이 있으면 request header에 토큰을 삽입하여 보낸다.
    if (typeof(window) == 'object' && VueCookies.isKey('token')) {
      //config.headers.Authorization = VueCookies.get('token');
      config.headers.Authorization = "Bearer " + VueCookies.get('token');
    }

    const { $Progress } = Vue.prototype;
    if ( $Progress ) {
      $Progress.start();
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response Interceptor
// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    const { status, data } = response;
    const { $toast, $Progress } = Vue.prototype;
    let errMsg = '';
    if (status !== 200) {
      errMsg = `Error code : ${status}`;
    }
    if (data.err) {
      errMsg = data.err;
    }

    console.log('AXIOS :', data);
    if (errMsg) {
      if ($toast) $toast.error(errMsg);
      if ($Progress) $Progress.fail();
      return false;
    } else {
      if ($Progress) $Progress.finish();
      return data;
    }
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = _axios;

export default _axios;
