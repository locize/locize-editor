[![Travis](https://img.shields.io/travis/locize/locize-editor/master.svg?style=flat-square)](https://travis-ci.org/locize/locize-editor)
[![npm version](https://img.shields.io/npm/v/locize-editor.svg?style=flat-square)](https://www.npmjs.com/package/locize-editor)
[![Bower](https://img.shields.io/bower/v/locize-editor.svg)]()
[![David](https://img.shields.io/david/locize/locize-editor.svg?style=flat-square)](https://david-dm.org/locize/locize-editor)

# locize-editor

The locize-editor enables you to directly connect content from your website / application with your content on your localization project on locize.

Enabling the editor by querystring `?locize=true` you can click any text content on your website to open it on the right side editor window:

![](http://docs.locize.com/assets/editor.png 'Screen of InContext Editor')

The linking could be turned on/off using the button on the lower right or by pressing `ctrl-x`.

## Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/locize-editor), bower, [downloaded](https://github.com/locize/locize/blob/master/locize.min.js) from this repo or loaded from the npm CDN [unpkg.com/locize-editor](https://unpkg.com/locize-editor/locize-editor.min.js).

If not using a bundler the script will be added to `window.locizeEditor`.

**Hint:** This module runs only in browser.

## Using

### standalone

Just init like:

```js
locizeEditor.init({
  lng: 'fr',
  defaultNS: 'namespaceToUse',
  projectId: '[yourProjectID]',
  referenceLng: 'en'
});
```

Open edit mode by appending `?locize=true` to the querystring.

For additional options see below **Initialize with optional options**

### with locizify

The editor is built into our [locizify script](https://github.com/locize/locizify). There is no additional step needed.

Open edit mode by appending `?locize=true` to the querystring.

For texts using plural or interpolation feature you might need to additionally add `&lng=cimode&useLng=[yourLocal]` to find a key.

### with i18next and i18next-locize-backend

```
import locizeEditor from 'locize-editor';
import i18next from 'locize';
import Backend from 'i18next-locize-backend';

i18next
  .use(Backend)
  .use(locizeEditor);
```

### Initialize with optional options

You can configure some aspects like layout by adding init options.

```js
// standalone
locizeEditor.init({
  // enable on init without the need of adding querystring locize=true
  enabled: false,
  autoOpen: true, // if set to false you will need to open it via API

  openDashboard: false, // open dashboard instead of the specified project

  // enable by adding querystring locize=true; can be set to another value or turned off by setting to false
  enableByQS: 'locize',

  // turn on/off by pressing
  toggleKeyModifier: 'ctrlKey', // metaKey | altKey | shiftKey
  toggleKeyCode: 24, // x when pressing ctrl (e.which: document.addEventListener('keypress', (e) => console.warn(e.which, e));

  // use lng in editor taken from query string, eg. if running with lng=cimode (i18next, locize)
  lngOverrideQS: 'useLng',

  // use lng in editor, eg. if running with lng=cimode (i18next, locize)
  lngOverride: null,

  // expect keys to have namespace prepend (CIMODE): text clicked is in form ns:key
  hasNamespacePrefixed: false,

  // default will open a iframe; setting to window will open a new window/tab instead
  mode: 'iframe' // 'window',

  // styles to adapt layout in iframe mode to your website layout
  iframeContainerStyle: 'z-index: 1000; position: fixed; top: 0; right: 0; bottom: 0; width: 600px; box-shadow: -3px 0 5px 0 rgba(0,0,0,0.5);',
  iframeStyle: 'height: 100%; width: 600px; border: none;',
  bodyStyle: 'margin-right: 605px;',

  // handle when locize saved the edited translations, eg. reload website
  onEditorSaved: function(lng, ns) { location.reload(); }
})

// i18next, ...
locizify|locize|i18next.init({
  editor: {
    // all options above
  }
});
```

### update your application when you saved changes in locize editor

use the onEditorSaved handler

```js
// reload the full page
locizeEditor.init({
  onEditorSaved: function(lng, ns) {
    location.reload();
  }
});

// reload translations in i18next and trigger a rerender
locizeEditor.init({
  onEditorSaved: function(lng, ns) {
    i18next.reloadResources(lng, ns, () => {
      // trigger rerender on your app if needed
      // note: reloadResources can take an optional callback in i18next@>=11.9.0
    });
  }
});
```

### update the locize editor if your site sent new save missings

the app will reload those namespaces

```js
locizeEditor.handleSavedMissing(lng, ns);

// eg. on your i18next-locize-backend bind the onSaved on init
i18next
  .use(locizeEditor)
  .use(locizeBackend)
  .init({
    //...
    backend: {
      //...
      onSaved: locizeEditor.handleSavedMissing
    }
  });
```

see the sample for react.js [i18next/react-i18next sample](https://github.com/i18next/react-i18next/blob/master/example/locize-example/src/i18n.js#L45)

### find the namespace

As content is structured into multiple translation files we somehow need to detect/find the namespace (file) used for translating the clicked content.

If locize is not able to detect the right namespace it will fallback for a fuzzy global search - which in most cases should also provide the correct result. But you might like to get more control.

##### by adding attribute containing namespace

The namespace will be detected from current clicked element or any of its parents.

Following attributes are valid to look it up:

```html
<!-- standalone -->
<div i18n-ns="myNamespace">content</div>
<div data-i18n-ns="myNamespace">content</div>

<!-- i18next: preferred -->
<div i18next-ns="myNamespace">content</div>
<div data-i18next-ns="myNamespace">content</div>

<!-- alternative: json stringified i18next options-->
<div i18next-options="{\"ns\":\"myNamespace\"}">content</div>
<div data-i18next-options="{\"ns\":\"myNamespace\"}">content</div>
```

##### by using cimode language

If there is no possibility to find the used namespace per attribute on parent element you will need to toggle the lng to cimode. Additionally you will need to configure locize to append namespace in cimode by:

```
i18next.init({
  appendNamespaceToCIMode: true
});
```

open your website with querystring `?locize=true&lng=cimode&useLng=[yourLocal]`.
