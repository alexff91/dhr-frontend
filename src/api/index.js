import axios from 'axios';

const BACKEND_URL = 'https://app.vi-hr.com:8082';

const http = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  timeout: 5000
});

export const Companies = (() => {
  const get = (companyId = '') => {
    return http.get(`/companies/${companyId}`);
  };

  const getVacancies = (companyId) => {
    return http.get(`/companies/${companyId}/vacancies`);
  };

  return {
    get,
    getVacancies
  };
})();

export const Vacancies = (() => {
  const get = (vacancyId = '') => {
    return http.get(`/vacancies/${vacancyId}`);
  };

  const getQuestions = (vacancyId = '') => {
    return http.get(`/vacancies/${vacancyId}/questions`);
  };

  return {
    get,
    getQuestions
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

  const get = (respondId) => {
    return http.get(`/responds/${respondId}`);
  };

  return {
    createRespond,
    get
  };
})();