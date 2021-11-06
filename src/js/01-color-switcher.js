const refs = {
  body: document.querySelector('body'),
  btnStart: document.querySelector('button[data-start]'),
  btnStop: document.querySelector('button[data-stop]'),
};

let timeoutId = null;
let isStarted = false;

refs.btnStart.addEventListener('click', onClickBtnStart);
refs.btnStop.addEventListener('click', onClickBtnStop);

function onClickBtnStart() {
  if (isStarted) {
    return;
  }

  paintBodyRecursive();
  isStarted = true;
}

function onClickBtnStop() {
  clearTimeout(timeoutId);
  isStarted = false;
}

function paintBodyRecursive() {
  refs.body.style.backgroundColor = getRandomHexColor();
  timeoutId = setTimeout(paintBodyRecursive, 1000);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
