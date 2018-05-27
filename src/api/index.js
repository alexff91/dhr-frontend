import axios from 'axios';

const BACKEND_URL = 'http://168.63.13.234:8080';

const http = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`
});

export const Companies = (() => {
  const get = (companyId = '') => {
    return http.get(`/companies/${companyId}`);
  };

  return {
    get
  };
})();

export const Vacancies = (() => {
  const get = (vacancyId = '') => {
    return http.get(`/vacancies/${vacancyId}`);
  };

  const getQuestions = (vacancyId) => {
    return http.get(`/vacancies/${vacancyId}/questions`);
  };

  return {
    get,
    getQuestions
  };
})();

export const Responds = (() => {
  const get = (respondId) => {
    return http.get(`/responds/${respondId}`);
  };

  return {
    get
  };
})();

export const Recordings = (() => {
  const upload = (file) => {
    return http.post(`/vacancy/1/responds/1/questions/1`, file);
  };
  return {
    upload
  };
})();