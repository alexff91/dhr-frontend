import axios from 'axios';

const BACKEND_URL = 'https://app.vi-hr.com:8082';

const http = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`
});

export const Vacancies = (() => {
  const get = (vacancyId = '') => {
    return http.get(`/vacancies/${vacancyId}`);
  };

  return {
    get
  };
})();

export const Recordings = (() => {
  const upload = (file, respondId, questionId) => {
    return http.post(`/responds/${respondId}/questions/${questionId}`, file);
  };

  return {
    upload
  };
})();

export const Responds = (() => {
  const createRespond = (vacancyId, data) => {
    return http.post(`/vacancies/${vacancyId}/responds`, data);
  };

  return {
    createRespond
  };
})();