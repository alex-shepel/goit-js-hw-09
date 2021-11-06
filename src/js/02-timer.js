import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('button[data-start]'),
  spanDays: document.querySelector('span[data-days]'),
  spanHours: document.querySelector('span[data-hours]'),
  spanMinutes: document.querySelector('span[data-minutes]'),
  spanSeconds: document.querySelector('span[data-seconds]'),
};

const TIME_STEP = 1000;
let isTimerRunning = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const isPastDate = selectedDates[0] < Date.now();
    if (isPastDate) {
      Notify.failure('Please choose a date in the future.');
      refs.btnStart.setAttribute('disabled', '');
      return;
    }
    Notify.info('Click START to run the timer.');
    refs.btnStart.removeAttribute('disabled');
  },
};

flatpickr(refs.input, options);
const fp = document.querySelector('#datetime-picker')._flatpickr;

const addLeadingZero = value => value.toString().padStart(2, '0');

const forEachValue = (obj, callback) =>
  Object.keys(obj).forEach(key => (obj[key] = callback(obj[key])));

const refreshTimer = ({ days, hours, minutes, seconds }) => {
  refs.spanDays.textContent = days;
  refs.spanHours.textContent = hours;
  refs.spanMinutes.textContent = minutes;
  refs.spanSeconds.textContent = seconds;
};

const getTimeLeftObj = () => {
  const msLeft = fp.selectedDates[0].getTime() - Date.now();
  const timeLeftObj = convertMs(msLeft);
  const prettyTimeLeftObj = { ...timeLeftObj };
  forEachValue(prettyTimeLeftObj, value => addLeadingZero(value));
  return prettyTimeLeftObj;
};

const startTimer = () => {
  const timeLeftObj = getTimeLeftObj();
  const isTimeOver = Object.values(timeLeftObj).every(val => val === '00');
  refreshTimer(timeLeftObj);

  if (isTimeOver) {
    Notify.success('Time ends up!');
    isTimerRunning = false;
    return;
  }

  setTimeout(startTimer, TIME_STEP, timeLeftObj);
};

const onClickBtn = () => {
  if (isTimerRunning) return;

  startTimer();
  Notify.info('Timer is running!');
  isTimerRunning = true;
};

refs.btnStart.setAttribute('disabled', '');
refs.btnStart.addEventListener('click', onClickBtn);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
