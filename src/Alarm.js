export default class Alarm extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;

  constructor() {
    super();
    this.addEventListener("click", this);
    this.duration = 60 * 1000;
    this.#intervalCallback = () => {
      this.alarms.forEach((alarm) => {
        const { value } = alarm.querySelector("input");
        if (value && !alarm.hasAttribute("paused")) {
          const [hours, minutes, seconds = 0] = value.split(":").map(Number);
          const date = new Date();
          date.setHours(hours, minutes, seconds, 0);
          const delta = Date.now() - date.getTime();
          if (delta > 0 && delta < this.duration) {
            if (!alarm.hasAttribute("ringing")) {
              alarm.setAttribute("ringing", "");
              this.dispatchEvent(
                new CustomEvent("ring", { bubbles: true, detail: alarm }),
              );
            }
            return;
          }
        }

        if (alarm.hasAttribute("ringing")) {
          alarm.removeAttribute("ringing");
          this.dispatchEvent(
            new CustomEvent("stop", { bubbles: true, detail: alarm }),
          );
        }
      });
    };
  }

  get alarms() {
    return [...this.querySelector(".items").children];
  }

  get duration() {
    return Number(this.getAttribute("duration"));
  }

  set duration(value) {
    this.setAttribute("duration", value);
  }

  add() {
    const alarm = this.querySelector("template").content.cloneNode(true);
    this.querySelector(".items").appendChild(alarm);
  }

  connectedCallback() {
    if (!this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 1000);
    }
  }

  delete(alarm) {
    const wasRinging = alarm.hasAttribute("ringing");
    this.querySelector(".items").removeChild(alarm);
    if (wasRinging) {
      this.dispatchEvent(
        new CustomEvent("stop", { bubbles: true, detail: alarm }),
      );
    }
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }

  handleEvent(event) {
    const { target } = event;
    const { classList } = target;
    if (classList.contains("add")) {
      this.add();
    } else if (classList.contains("delete")) {
      this.delete(this.alarms.find((alarm) => alarm.contains(target)));
    } else if (classList.contains("pause")) {
      this.pause(this.alarms.find((alarm) => alarm.contains(target)));
    } else if (classList.contains("start")) {
      this.start(this.alarms.find((alarm) => alarm.contains(target)));
    }
  }

  pause(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.setAttribute("paused", "");
      if (alarm.hasAttribute("ringing")) {
        alarm.removeAttribute("ringing");
        this.dispatchEvent(
          new CustomEvent("stop", { bubbles: true, detail: alarm }),
        );
      }
    }
  }

  start(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.removeAttribute("paused");
    }
  }
}
