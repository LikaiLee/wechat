const axios = require('axios');
const { BASE_API } = require('../config');

const service = axios.create({
  baseURL: BASE_API,
  timeout: 15000
});
service.interceptors.request.use(config => {
    return config;
  },
  err => {
    return Promise.reject(error);
  });
service.interceptors.response.use(res => {
    return res;
  },
  err => {
    return Promise.reject(error);
  });

module.exports = service;