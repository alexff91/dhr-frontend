import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

const http = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`
});

export const Vacancies = (() => {
  const get = (vacancyId = '') => {
    return http.get(`/vacancies/${vacancyId}`);
  };

  const getRespondById = (vacancyId, respondId) => {
    return http.get(`/vacancies/${vacancyId}/respond/${respondId}`);
  };

  return {
    get,
    getRespondById
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

export const RespondentFeedback = (() => {
  const post = (respondId, data) => {
    return http.post(`/respondentFeedback/${respondId}`, data);
  };

  return {
    post
  };
})();