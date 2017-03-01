import { getClickedElement, getElementNamespace, getQueryVariable, removeNamespace } from './utils';
import { initUI } from './ui';

const defaultOptions = {
  url: 'https://www.locize.io',
  enabled: false,
  enableByQS: 'locize',
  autoOpen: true
}

const editor = {
  type: '3rdParty',

  init(i18next) {
    this.i18next = i18next;
    this.options = { ...defaultOptions, ...i18next.options.editor };
    this.locizeUrl = (i18next.options.editor && i18next.options.editor.url) || 'https://www.locize.io';

    this.handler = this.handler.bind(this);

    if (this.options.enabled || (this.options.enableByQS && getQueryVariable(this.options.enableByQS))) {
      setTimeout(() => {
        this.toggleUI = initUI(this.on.bind(this), this.off.bind(this));
        if (this.options.autoOpen) this.open();
        this.on();
      }, 500);
    }
  },

  handler(e) {
    const el = getClickedElement(e);
    if (!el) return;

    const str = el.textContent || el.text.innerText;
    const res = str.replace(/\n +/g, '').trim();



    const send = () => {
      // alternative consume
      // window.addEventListener('message', function(ev) {
      //   if (ev.data.message === 'searchForKey') {
      //     console.warn(ev.data);
      //   }
      // });
      const payload = {
        message: 'searchForKey',
        projectId: this.i18next.options.backend.projectId,
        version: this.i18next.options.backend.version || 'latest',
        lng: this.i18next.languages[0],
        ns: getElementNamespace(res, el, this.i18next),
        token: removeNamespace(res, this.i18next)
      };
      if (!payload.lng || payload.lng.toLowerCase() === 'cimode') payload.lng = this.i18next.options.backend.referenceLng;
      if (this.options.handler) return this.options.handler(payload);

      this.locizeInstance.postMessage(payload, this.options.url);
      this.locizeInstance.focus();
    }

    // assert the locizeInstance is still open
    if (this.options.autoOpen && (!this.locizeInstance || this.locizeInstance.closed)) {
      this.open();
      setTimeout(() => {
        send();
      }, 3000);
    } else {
      send();
    }

  },

  open() {
    this.locizeInstance = window.open(this.options.url);
  },

  on() {
    document.body.addEventListener("click", this.handler);
    this.toggleUI(true);
  },

  off() {
    document.body.removeEventListener("click", this.handler);
    this.toggleUI(false);
  }
};

export default editor;
