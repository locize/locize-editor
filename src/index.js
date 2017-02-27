import { getClickedElement, getElementNamespace } from './utils';

const editor = {
  init(i18next) {
    this.subscriber = [];
    this.i18next = i18next;
    setTimeout(() => {
      this.on();
    }, 100);

    this.locizeInstance = window.open('/receiver');

    window.subscribeLocizeEditor = this.subscribe.bind(this);
  },

  subscribe(fc) {
    this.subscriber.push(fc)
  },

  handler(e) {
    const el = getClickedElement(e);
    if (!el) return;

    const str = el.textContent || el.text.innerText;
    const res = str.replace(/\n +/g, '');

    console.warn(el, res);
    console.warn(getElementNamespace(res, el, this.i18next))
    console.warn('projectId', this.i18next.options.backend.projectId)
    console.warn('language', this.i18next.languages[0])

    this.subscriber.forEach(fc => {
      fc(this.i18next.options.backend.projectId, this.i18next.languages[0], getElementNamespace(res, el, this.i18next), res);
    });
  },

  on() {
    document.body.addEventListener("click", this.handler.bind(this));
  },

  off() {
    document.body.removeEventListener("click", this.handler.bind(this));
  }
};

export default editor;
