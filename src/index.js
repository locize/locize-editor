import { getClickedElement, getElementNamespace, getQueryVariable, removeNamespace } from './utils';
import { initUI, appendIframe } from './ui';

const defaultOptions = {
  url: 'https://www.locize.io',
  enabled: false,
  enableByQS: 'locize',
  toggleKeyCode: 24,
  toggleKeyModifier: 'ctrlKey',
  lngOverrideQS: 'useLng',
  autoOpen: true,
  onEditorSaved: (lng, ns) => {},
  mode: getQueryVariable('locizeMode') || 'iframe',
  iframeContainerStyle: 'z-index: 2000; position: fixed; top: 0; right: 0; bottom: 0; width: 600px; box-shadow: -3px 0 5px 0 rgba(0,0,0,0.5);',
  iframeStyle: 'height: 100%; width: 600px; border: none;',
  bodyStyle: 'margin-right: 605px;'
}

function convertOptionsToI18next(opts) {
  return {
    languages: [opts.lng],
    nsSeparator: opts.nsSeparator || ':',
    options: {
      editor: opts,
      backend: opts,
      defaultNS: opts.defaultNS
    }
  };
}

const editor = {
  type: '3rdParty',

  init(i18next) {
    // convert standalone options
    if (i18next && !i18next.init) i18next = convertOptionsToI18next(i18next);

    this.enabled = false;
    this.i18next = i18next;
    this.options = { ...defaultOptions, ...i18next.options.editor };
    this.locizeUrl = (i18next.options.editor && i18next.options.editor.url) || 'https://www.locize.io';

    this.handler = this.handler.bind(this);

    if (this.options.enabled || (this.options.enableByQS && getQueryVariable(this.options.enableByQS) === 'true')) {
      setTimeout(() => {
        this.toggleUI = initUI(this.on.bind(this), this.off.bind(this), this.options);
        if (this.options.autoOpen) this.open();
        this.on();
      }, 500);
    }

    document.addEventListener('keypress', (e) => {
      if (e[this.options.toggleKeyModifier] && e.which === this.options.toggleKeyCode) this.enabled ? this.off() : this.on();
    });

    // listen to key press on locize service to disable
    window.addEventListener('message', (e) => {
      if (e.data[this.options.toggleKeyModifier] && e.data.which === this.options.toggleKeyCode) this.enabled ? this.off() : this.on();

      if (e.data.type === 'savedSegments') {
        this.options.onEditorSaved(e.data.lng, e.data.ns);
      }
    });
  },

  handler(e) {
    e.preventDefault();
    e.stopPropagation();

    const el = getClickedElement(e);
    if (!el) return;

    const str = el.textContent || (el.text && el.text.innerText) || el.placeholder;
    const res = str.replace(/\n +/g, '').trim();



    const send = () => {
      // consume
      // window.addEventListener('message', function(ev) {
      //   if (ev.data.message === 'searchForKey') {
      //     console.warn(ev.data);
      //   }
      // });
      const payload = {
        message: 'searchForKey',
        projectId: this.i18next.options.backend.projectId,
        version: this.i18next.options.backend.version || 'latest',
        lng: getQueryVariable(this.options.lngOverrideQS) || this.i18next.languages[0],
        ns: getElementNamespace(res, el, this.i18next),
        token: removeNamespace(res, this.i18next)
      };
      if (!payload.lng || payload.lng.toLowerCase() === 'cimode') payload.lng = this.i18next.options.backend.referenceLng;
      if (this.options.handler) return this.options.handler(payload);

      this.locizeInstance.postMessage(payload, this.options.url);
      this.locizeInstance.focus();
    }

    // assert the locizeInstance is still open
    if (this.options.autoOpen && (this.options.mode !== 'iframe' && !this.locizeInstance || this.locizeInstance.closed)) {
      this.open();
      setTimeout(() => {
        send();
      }, 3000);
    } else {
      send();
    }

  },

  open() {
    if (this.options.mode === "iframe") return this.locizeInstance = appendIframe(this.options.url, this.options);
    this.locizeInstance = window.open(this.options.url);
  },

  on() {
    document.body.addEventListener("click", this.handler);
    this.toggleUI(true);
    this.enabled = true;
  },

  off() {
    document.body.removeEventListener("click", this.handler);
    this.toggleUI(false);
    this.enabled = false;
  }
};

export default editor;
