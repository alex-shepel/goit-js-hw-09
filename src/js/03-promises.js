import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('form'),
};

const createPromise = (position, delay) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay),
  );

const onSubmit = e => {
  e.preventDefault();

  const data = {};

  [...e.target.elements]
    .filter(elem => elem.tagName === 'INPUT')
    .forEach(elem => (data[elem.name] = parseInt(elem.value)));

  for (let i = 1; i <= data.amount; i += 1) {
    createPromise(i, data.delay + i * data.step)
      .then(({ position, delay }) => {
        Notify.success(`Resolved promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });
  }
};

refs.form.addEventListener('submit', onSubmit);
