(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['locize-editor'] = factory());
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

var editor = {
  init: function init(i18next) {
    var _this = this;

    this.subscriber = [];
    this.i18next = i18next;
    setTimeout(function () {
      _this.on();
    }, 100);

    this.locizeInstance = window.open('/receiver');

    window.subscribeLocizeEditor = this.subscribe.bind(this);
  },
  subscribe: function subscribe(fc) {
    this.subscriber.push(fc);
  },
  handler: function handler(e) {
    var _this2 = this;

    var el = getClickedElement(e);
    if (!el) return;

    var str = el.textContent || el.text.innerText;
    var res = str.replace(/\n +/g, '');

    console.warn(el, res);
    console.warn(getElementNamespace(res, el, this.i18next));
    console.warn('projectId', this.i18next.options.backend.projectId);
    console.warn('language', this.i18next.languages[0]);

    this.subscriber.forEach(function (fc) {
      fc(_this2.i18next.options.backend.projectId, _this2.i18next.languages[0], getElementNamespace(res, el, _this2.i18next), res);
    });
  },
  on: function on() {
    document.body.addEventListener("click", this.handler.bind(this));
  },
  off: function off() {
    document.body.removeEventListener("click", this.handler.bind(this));
  }
};

return editor;

})));
