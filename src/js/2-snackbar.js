import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delayMs = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delayMs);
      } else {
        reject(delayMs);
      }
    }, delayMs);
  });

  promise
    .then(delayMs => {
      console.log(`✅ Fulfilled promise in ${delayMs}ms`);
      iziToast.success({
        title: 'Success',
        message: `Fulfilled promise in ${delayMs}ms`,
        position: 'topRight',
        backgroundColor: '#59a10d',
      });
    })

    .catch(delayMs => {
      console.log(`❌ Rejected promise in ${delayMs}ms`);
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delayMs}ms`,
        position: 'topRight',
      });
    })
    .finally(() => {
      form.reset();
    });
});
