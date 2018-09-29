// @flow
import defaultClient from './defaultClient';

const requests = [];

let progress = 0;
let timerId = null;

function setProgress(value: number) {
  progress = value;
  if (typeof window !== 'undefined' && window.nanobar) {
    window.nanobar.go(progress);
  }
}

function timer() {
  if (progress < 98) {
    const diff = 100 - progress;
    const inc = diff / (10 + progress * (1 + progress / 100));
    setProgress(progress + inc);
  }
  timerId = setTimeout(timer, 50);
}

export function setup() {
  defaultClient.interceptors.request.use((req) => {
    if (requests.length === 0) {
      setProgress(25);
      timer();
    }
    requests.push(req);
    return req;
  });
  const responseHandler = (res) => {
    setTimeout(() => {
      requests.pop();
      if (requests.length === 0) {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        setProgress(100);
      }
    }, 150);
    return res;
  };
  const errorHandler = (response) => {
    setTimeout(() => {
      requests.pop();
      if (requests.length === 0) {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        setProgress(100);
      }
    }, 150);
    return Promise.reject(response);
  };
  defaultClient.interceptors.response.use(responseHandler, errorHandler);
}
