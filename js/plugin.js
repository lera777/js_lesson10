const timer = (function () {
  let countdown,
      timerDisplay,
      endTime,
      alarmSound;
  // Инициализация модуля
  function init(settings) {
    timerDisplay = document.querySelector(settings.timerDisplaySelector);
    endTime = document.querySelector(settings.endTimeSelector);
    alarmSound = new Audio(settings.alarmSounds);
    return this;
  }

  function start(seconds) {
    if(typeof seconds !== "number") return new Error('Please provide seconds!');
    const now = Date.now();
    const then = now + seconds * 1000;

    displayTimeLeft(seconds);
    displayEndTime(then);

    countdown = setInterval(() => {
      let secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
        clearInterval(countdown);
        alarmSound.play();
        return;
      }
      displayTimeLeft(secondsLeft);
    }, 1000); 
    return this;
  }

  function stop(){
    clearInterval(countdown);
    document.title = '';
    timerDisplay.textContent = '';
    endTime.textContent = '';
    alarmSound.pause();
    alarmSound.currentTime = 0;
    return this;
  }

  function displayTimeLeft(seconds) {
    let day,
        hour,
        minutes,
        hourDisplay = '',
        reminderSeconds = seconds % 60;

    minutes = Math.floor(seconds / 60);
    if (minutes > 60) {
      hour = Math.floor(minutes / 60);
      minutes -= hour * 60;
      if (hour > 24) {
        day = Math.floor(hour / 24);
        hour -= day * 24;
      }
    }
    if (hour){
      hourDisplay = hour +':';
      if(hour < 10) {
        hourDisplay ='0'+ hourDisplay;
    }
  }
    const display = `${day > 0 ? day + ':' : ''}${hourDisplay}${minutes < 10 ? '0' : ''}${minutes}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}`;
    timerDisplay.textContent = display;
    document.title = display;
  }

  function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    endTime.textContent = `Be back at ${end.toLocaleString('en-GB')}`
  }

  return {
    init,
    start,
    stop
  }
})();

const buttons = document.querySelectorAll('[data-time]');
const buttonStop = document.querySelector('.stop_timer_button');
const startInput = document.forms.customForm;

timer.init({
  timerDisplaySelector: '.display__time-left',
  endTimeSelector :'.display__end-time',
  alarmSounds: 'audio/bell.mp3'
});

// Start timer on click
function startTimer(e) {
  // timer.stop();
  e.preventDefault();
  let seconds;
  if (e.type === 'submit'){
    seconds = parseInt(this.elements.minutes.value, 10) * 60;
    this.elements.minutes.value = '';
  }else seconds = Number(this.dataset.time);
  timer.start(seconds);
}
function stopTimer(e) {
  timer.stop();
}

buttons.forEach(btn => btn.addEventListener('click', startTimer));
startInput.addEventListener('submit', startTimer);
buttonStop.addEventListener('click', stopTimer);