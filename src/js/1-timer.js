import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputimer = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');

const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    const currentDate = new Date();

    if (userSelectedDate < currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#e74c3c',
        color: 'white',
        progressBarColor: 'white',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
  locale: {
    firstDayOfWeek: 1,
  },
};

flatpickr(inputimer, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  if (!userSelectedDate) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please select a date and time first!',
      position: 'topRight',
      backgroundColor: '#f39c12',
      color: 'white',
      progressBarColor: 'white',
    });
    return;
  }

  const currentDate = new Date();
  let msRemaining = userSelectedDate.getTime() - currentDate.getTime();
  if (msRemaining <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
      backgroundColor: '#e74c3c',
      color: 'white',
      progressBarColor: 'white',
    });
    return;
  }

  inputimer.disabled = true;
  startButton.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    msRemaining = userSelectedDate.getTime() - now.getTime();

    if (msRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Success',
        message: 'Countdown complete!',
        position: 'topRight',
        backgroundColor: ' #59a10d',
        color: 'white',
        progressBarColor: 'white',
      });
      inputimer.disabled = false;
      startButton.disabled = true;
      return;
    }

    const time = convertMs(msRemaining);
    updateTimerDisplay(time);
  }, 1000);
}

startButton.addEventListener('click', startCountdown);
