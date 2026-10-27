import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";
import alarmSoundUrl from "./sounds/alarm.wav";
import timerSoundUrl from "./sounds/timer.wav";

customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);

const navigation = document.querySelector("nav");
const alarm = document.querySelector("x-alarm");
const timer = document.querySelector("x-timer");
const alarmSound = new Audio(alarmSoundUrl);
const timerSound = new Audio(timerSoundUrl);

function updateCurrentPage() {
  const hash = window.location.hash || "#clock";
  navigation.querySelectorAll("a").forEach((link) => {
    if (link.hash === hash) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", updateCurrentPage);
updateCurrentPage();

alarmSound.loop = true;
alarmSound.preload = "auto";
timerSound.preload = "auto";

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch((error) => {
    console.error("Could not play audio:", error);
  });
}

alarm.addEventListener("ring", () => {
  if (alarmSound.paused) {
    playSound(alarmSound);
  }
});

alarm.addEventListener("stop", () => {
  if (!alarm.alarms.some((item) => item.hasAttribute("ringing"))) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
});

timer.addEventListener("stop", () => playSound(timerSound));
