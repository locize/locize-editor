(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.locizeEditor = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }
  function offset(elem) {
    var docElem,
        win,
        box = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
        doc = elem && elem.ownerDocument;
    docElem = doc && doc.documentElement;
    if (!docElem) return box;

    if (_typeof(elem.getBoundingClientRect) !== ("undefined")) {
      box = elem.getBoundingClientRect();
    }

    win = getWindow(doc);
    var top = box.top + win.pageYOffset - docElem.clientTop;
    var left = box.left + win.pageXOffset - docElem.clientLeft;
    return {
      top: top,
      left: left,
      right: left + (box.right - box.left),
      bottom: top + (box.bottom - box.top)
    };
  }
  function getClickedElement(e) {
    // clicked input
    if (e.srcElement && e.srcElement.nodeType === 1) {
      if (e.srcElement.getAttribute && e.srcElement.getAttribute('ignorelocizeeditor') === '') return null;
      return e.srcElement;
    }

    var el;

    if (e.originalEvent && e.originalEvent.explicitOriginalTarget) {
      el = e.originalEvent.explicitOriginalTarget;
    } else {
      var parent = e.srcElement;
      if (parent.getAttribute && parent.getAttribute('ignorelocizeeditor') === '') return null;
      var left = e.pageX;
      var top = e.pageY;
      var pOffset = offset(parent); // console.warn('click', top, left);
      // console.warn('parent', parent, pOffset, parent.clientHeight, parent.offsetHeight);

      var topStartsAt = 0;
      var topBreaksAt;

      for (var i = 0; i < parent.childNodes.length; i++) {
        var n = parent.childNodes[i];
        var nOffset = offset(n); // console.warn('child', n, nOffset, n.clientHeight, n.offsetHeight)
        // if a node is with the bottom over the top click set the next child as start index

        if (n.nodeType === 1 && nOffset.bottom < top) topStartsAt = i + 1; // if node is below top click set end index to this node

        if (!topBreaksAt && nOffset.top + (n.clientHeight || 0) > top) topBreaksAt = i;
      } // check we are inside children lenght


      if (topStartsAt + 1 > parent.childNodes.length) topStartsAt = parent.childNodes.length - 1;
      if (!topBreaksAt) topBreaksAt = parent.childNodes.length; // console.warn('bound', topStartsAt, topBreaksAt)
      // inside our boundaries check when left is to big and out of clicks left

      for (var y = topStartsAt; y < topBreaksAt; y++) {
        var _n = parent.childNodes[y];

        var _nOffset = offset(_n);

        if (_nOffset.left > left) {
          break;
        }

        if (_n && _n.nodeType !== 8) el = _n;
      }
    }

    return el;
  }
  function removeNamespace(str, i18next) {
    var res = str;
    var nsSeparator = i18next.options.nsSeparator !== undefined ? i18next.options.nsSeparator : ':';

    if (str.indexOf(nsSeparator) > -1) {
      var p = str.split(nsSeparator);
      p.shift();
      res = p.join(nsSeparator);
    }

    return res;
  }
  function getElementNamespace(str, el, i18next) {
    var namespace = i18next.options.defaultNS;
    var nsSeparator = i18next.options.nsSeparator || ':';

    if (str.indexOf(nsSeparator) > -1) {
      namespace = str.split(nsSeparator)[0];
    } else {
      var found;

      var find = function find(el) {
        var opts = el.getAttribute && el.getAttribute('i18next-options');
        if (!opts) opts = el.getAttribute && el.getAttribute('data-i18next-options');
        if (!opts) opts = el.getAttribute && el.getAttribute('i18n-options');
        if (!opts) opts = el.getAttribute && el.getAttribute('data-i18n-options');

        if (opts) {
          var jsonData = {};

          try {
            jsonData = JSON.parse(opts);
          } catch (e) {// not our problem here in editor
          }

          if (jsonData.ns) found = jsonData.ns;
        }

        if (!found) found = el.getAttribute && el.getAttribute('i18next-ns');
        if (!found) found = el.getAttribute && el.getAttribute('data-i18next-ns');
        if (!found) found = el.getAttribute && el.getAttribute('i18n-ns');
        if (!found) found = el.getAttribute && el.getAttribute('data-i18n-ns');
        if (!found && el.parentElement) find(el.parentElement);
      };

      find(el);
      if (found) namespace = found;
    }

    return namespace;
  }
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] == variable) {
        return pair[1];
      }
    }

    return false;
  }

  var baseBtn = 'font-family: "Helvetica", "Arial", sans-serif; font-size: 14px; color: #fff; border: none; font-weight: 300; height: 30px; line-height: 30px; padding: 0; text-align: center; min-width: 90px; text-decoration: none; text-transform: uppercase; text-overflow: ellipsis; white-space: nowrap; outline: none; cursor: pointer;';
  function initUI(on, off, options) {
    var cont = document.createElement("div");
    cont.setAttribute('style', 'z-index: 2147483647; font-family: "Helvetica", "Arial", sans-serif; position: fixed; bottom: 20px; right: 20px; padding: 10px; background-color: #fff; border: solid 1px #1976d2; box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);');
    cont.setAttribute('ignorelocizeeditor', '');
    cont.setAttribute('translated', '');
    var title = document.createElement("h4");
    title.id = "locize-title";
    title.innerHTML = "locize editor";
    title.setAttribute('style', 'font-family: "Helvetica", "Arial", sans-serif; font-size: 14px; margin: 0 0 5px 0; color: #1976d2; font-weight: 300;');
    title.setAttribute('ignorelocizeeditor', '');
    cont.appendChild(title);
    var turnOff = document.createElement("button");
    turnOff.innerHTML = "On";
    turnOff.setAttribute('style', "".concat(baseBtn, " display: none; background-color: #54A229;"));
    turnOff.onclick = off;
    turnOff.setAttribute('ignorelocizeeditor', '');
    cont.appendChild(turnOff);
    var turnOn = document.createElement("button");
    turnOn.innerHTML = "Off";
    turnOn.setAttribute('style', "".concat(baseBtn, " display: none; background-color: #D50000;"));
    turnOn.onclick = on;
    turnOn.setAttribute('ignorelocizeeditor', '');
    cont.appendChild(turnOn);
    document.body.appendChild(cont);

    var toggle = function toggle(on) {
      turnOff.style.display = on ? 'block' : 'none';
      turnOn.style.display = !on ? 'block' : 'none';
    };

    return toggle;
  }
  function appendIframe(url, options) {
    var cont = document.createElement("div");
    cont.setAttribute('style', options.iframeContainerStyle);
    cont.setAttribute('ignorelocizeeditor', '');
    cont.setAttribute('translated', '');
    var iframe = document.createElement("iframe");
    iframe.setAttribute('style', options.iframeStyle);
    iframe.setAttribute('ignorelocizeeditor', '');
    iframe.setAttribute('translated', '');
    iframe.setAttribute('src', url);
    cont.appendChild(iframe);
    document.body.appendChild(cont);
    var bodyStyle = document.body.getAttribute('style');
    document.body.setAttribute('style', "".concat(bodyStyle, "; ").concat(options.bodyStyle));
    return iframe.contentWindow;
  }

  var defaultOptions = {
    url: 'https://www.locize.io',
    openDashboard: false,
    enabled: false,
    enableByQS: 'locize',
    toggleKeyCode: 24,
    toggleKeyModifier: 'ctrlKey',
    lngOverrideQS: 'useLng',
    lngOverride: null,
    hasNamespacePrefixed: false,
    autoOpen: true,
    onEditorSaved: function onEditorSaved(lng, ns) {},
    mode: getQueryVariable('locizeMode') || 'iframe',
    iframeContainerStyle: 'z-index: 2147480000; position: fixed; top: 0; right: 0; bottom: 0; width: 600px; box-shadow: -3px 0 5px 0 rgba(0,0,0,0.5);',
    iframeStyle: 'height: 100%; width: 600px; border: none;',
    bodyStyle: 'margin-right: 605px;'
  };

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

  var editor = {
    type: '3rdParty',
    init: function init(i18next) {
      var _this = this;

      // convert standalone options
      if (i18next && !i18next.init) i18next = convertOptionsToI18next(i18next);
      this.enabled = false;
      this.i18next = i18next;
      this.options = _objectSpread({}, defaultOptions, i18next.options.editor); //this.locizeUrl = (i18next.options.editor && i18next.options.editor.url) || 'https://www.locize.io';

      this.handler = this.handler.bind(this);
      this.handleSavedMissing = this.handleSavedMissing.bind(this);

      if (this.options.enabled || this.options.enableByQS && getQueryVariable(this.options.enableByQS) === 'true') {
        setTimeout(function () {
          if (_this.options.autoOpen) _this.open();
        }, 500);
      }

      document.addEventListener('keypress', function (e) {
        if (e[_this.options.toggleKeyModifier] && e.which === _this.options.toggleKeyCode) _this.enabled ? _this.off() : _this.on();
      }); // listen to key press on locize service to disable

      window.addEventListener('message', function (e) {
        if (e.data[_this.options.toggleKeyModifier] && e.data.which === _this.options.toggleKeyCode) _this.enabled ? _this.off() : _this.on();

        if (e.data.type === 'savedSegments') {
          _this.options.onEditorSaved(e.data.lng, e.data.ns);
        }
      });
    },
    handler: function handler(e) {
      var _this2 = this;

      var el = getClickedElement(e);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      var str = el.textContent || el.text && el.text.innerText || el.placeholder;
      if (typeof str !== 'string') return;
      var res = str.replace(/\n +/g, '').trim();

      var send = function send() {
        // consume
        // window.addEventListener('message', function(ev) {
        //   if (ev.data.message === 'searchForKey') {
        //     console.warn(ev.data);
        //   }
        // });
        var payload = {
          message: 'searchForKey',
          projectId: _this2.i18next.options.backend.projectId,
          version: _this2.i18next.options.backend.version || 'latest',
          lng: getQueryVariable(_this2.options.lngOverrideQS) || _this2.options.lngOverride || _this2.i18next.languages[0],
          ns: getElementNamespace(res, el, _this2.i18next),
          token: _this2.options.hasNamespacePrefixed ? removeNamespace(res, _this2.i18next) : res
        };
        if (!payload.lng || payload.lng.toLowerCase() === 'cimode') payload.lng = _this2.i18next.options.backend.referenceLng;
        if (_this2.options.handler) return _this2.options.handler(payload);

        _this2.locizeInstance.postMessage(payload, _this2.options.url);

        _this2.locizeInstance.focus();
      }; // assert the locizeInstance is still open


      if (this.options.autoOpen && (this.options.mode !== 'iframe' && !this.locizeInstance || this.locizeInstance.closed)) {
        this.open();
        setTimeout(function () {
          send();
        }, 3000);
      } else {
        send();
      }
    },
    handleSavedMissing: function handleSavedMissing(lng, ns) {
      if (!this.locizeInstance || this.locizeInstance.closed) return;
      var payload = {
        message: 'savedMissings',
        projectId: this.i18next.options.backend.projectId,
        version: this.i18next.options.backend.version || 'latest',
        lng: lng,
        ns: ns
      };
      this.locizeInstance.postMessage(payload, this.options.url);
    },
    open: function open() {
      var url = this.options.url;
      if (!this.options.openDashboard) url = "".concat(url, "/pid/").concat(this.options.projectId || this.i18next.options.backend.projectId, "/v/").concat(this.i18next.options.backend.version || 'latest');

      if (this.options.mode === 'iframe') {
        this.locizeInstance = appendIframe(url, this.options);
      } else {
        this.locizeInstance = window.open(url);
      } // bind toggle UI


      this.toggleUI = initUI(this.on.bind(this), this.off.bind(this), this.options); // start listening

      this.on();
    },
    on: function on() {
      document.body.addEventListener('click', this.handler, true);
      this.toggleUI(true);
      this.enabled = true;
    },
    off: function off() {
      document.body.removeEventListener('click', this.handler, true);
      this.toggleUI(false);
      this.enabled = false;
    }
  };

  return editor;

}));
