(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.locizeEditor = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isWindow(obj) {
  return obj != null && obj === obj.window;
}

function getWindow(elem) {
  return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

function offset(elem) {
  var docElem,
      win,
      box = { top: 0, left: 0, right: 0, bottom: 0 },
      doc = elem && elem.ownerDocument;

  docElem = doc.documentElement;

  if (_typeof(elem.getBoundingClientRect) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) {
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
  var el = void 0,
      toHigh = void 0,
      toLeft = void 0,
      toLeftNextOffset = void 0;

  if (e.originalEvent && e.originalEvent.explicitOriginalTarget) {
    el = e.originalEvent.explicitOriginalTarget;
  } else {
    var parent = e.srcElement;
    if (parent.getAttribute && parent.getAttribute('ignorelocizeeditor') === '') return null;

    var left = e.pageX;
    var top = e.pageY;
    var pOffset = offset(parent);
    // console.warn('click', top, left);
    // console.warn('parent', parent, pOffset, parent.clientHeight, parent.offsetHeight);

    var topStartsAt = 0;
    var topBreaksAt = void 0;
    for (var i = 0; i < parent.childNodes.length; i++) {
      var n = parent.childNodes[i];
      var nOffset = offset(n);
      // console.warn('child', n, nOffset, n.clientHeight, n.offsetHeight)

      // if a node is with the bottom over the top click set the next child as start index
      if (n.nodeType === 1 && nOffset.bottom < top) topStartsAt = i + 1;

      // if node is below top click set end index to this node
      if (!topBreaksAt && nOffset.top + (n.clientHeight || 0) > top) topBreaksAt = i;
    }

    // check we are inside children lenght
    if (topStartsAt + 1 > parent.childNodes.length) topStartsAt = parent.childNodes.length - 1;
    if (!topBreaksAt) topBreaksAt = parent.childNodes.length;
    // console.warn('bound', topStartsAt, topBreaksAt)

    // inside our boundaries check when left is to big and out of clicks left
    for (var y = topStartsAt; y < topBreaksAt; y++) {
      var _n = parent.childNodes[y];
      var _nOffset = offset(_n);

      if (!toLeft && _nOffset.left > left) {
        el = parent.childNodes[y - 1];
        break;
      }

      el = _n;
    }
  }
  return el;
}

function getElementNamespace(str, el, i18next) {
  var namespace = i18next.options.defaultNS;
  var nsSeparator = i18next.options.nsSeparator;

  if (str.indexOf(nsSeparator) > -1) {
    namespace = str.split(nsSeparator)[0];
  } else {
    var found = void 0;

    var find = function find(el) {
      var opts = el.getAttribute && el.getAttribute('i18next-options');
      if (opts) {
        var jsonData = {};
        try {
          jsonData = JSON.parse(opts);
        } catch (e) {
          // not our problem here in editor
        }
        if (jsonData.ns) found = jsonData.ns;
      }

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

function initUI(on, off) {
  var cont = document.createElement("div");
  cont.setAttribute('style', 'font-family: "Helvetica", "Arial", sans-serif; position: fixed; bottom: 20px; right: 20px; padding: 10px; background-color: #fff; border: solid 1px #1976d2; box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);');
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
  turnOff.setAttribute('style', baseBtn + ' display: none; background-color: #54A229;');
  turnOff.onclick = off;
  turnOff.setAttribute('ignorelocizeeditor', '');
  cont.appendChild(turnOff);

  var turnOn = document.createElement("button");
  turnOn.innerHTML = "Off";
  turnOn.setAttribute('style', baseBtn + ' display: none; background-color: #D50000;');
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultOptions = {
  url: 'https://www.locize.io',
  enabled: false,
  enableByQS: 'locize',
  autoOpen: true
};

var editor = {
  type: '3rdParty',

  init: function init(i18next) {
    var _this = this;

    this.i18next = i18next;
    this.options = _extends({}, defaultOptions, i18next.options.editor);
    this.locizeUrl = i18next.options.editor && i18next.options.editor.url || 'https://www.locize.io';

    this.handler = this.handler.bind(this);

    if (this.options.enabled || this.options.enableByQS && getQueryVariable(this.options.enableByQS)) {
      setTimeout(function () {
        _this.toggleUI = initUI(_this.on.bind(_this), _this.off.bind(_this));
        _this.open();
        _this.on();
      }, 500);
    }
  },
  handler: function handler(e) {
    var _this2 = this;

    var el = getClickedElement(e);
    if (!el) return;

    var str = el.textContent || el.text.innerText;
    var res = str.replace(/\n +/g, '').trim();

    var send = function send() {
      // alternative consume
      // window.addEventListener('message', function(ev) {
      //   if (ev.data.message === 'searchForKey') {
      //     console.warn(ev.data);
      //   }
      // });
      var payload = {
        message: 'searchForKey',
        projectId: _this2.i18next.options.backend.projectId,
        version: _this2.i18next.options.backend.version || 'latest',
        lng: _this2.i18next.languages[0],
        ns: getElementNamespace(res, el, _this2.i18next),
        token: res
      };
      if (_this2.options.handler) return _this2.options.handler(payload);

      _this2.locizeInstance.postMessage(payload, _this2.options.url);
      _this2.locizeInstance.focus();
    };

    // assert the locizeInstance is still open
    if (this.options.autoOpen && (!this.locizeInstance || this.locizeInstance.closed)) {
      this.open();
      setTimeout(function () {
        send();
      }, 3000);
    } else {
      send();
    }
  },
  open: function open() {
    this.locizeInstance = window.open(this.options.url);
  },
  on: function on() {
    document.body.addEventListener("click", this.handler);
    this.toggleUI(true);
  },
  off: function off() {
    document.body.removeEventListener("click", this.handler);
    this.toggleUI(false);
  }
};

return editor;

})));
