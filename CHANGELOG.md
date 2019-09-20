### 2.2.2

- z-index correction on the toggle UI

### 2.2.1

- fix hasNamespacePrefixed

### 2.2.0

- only default namespace separator to ':' if undefined in i18next.options -> do not split : away on text if not set so
- add option hasNamespacePrefixed (default false) -> setting false will avoid splitting
- extend iframe z-index to 2147483647 based on [stackoverflow](https://stackoverflow.com/questions/491052/minimum-and-maximum-value-of-z-index/25461690) the max
- have a handler for handleSavedMissing(lng, ns)

### 2.1.3

- bind on open

### 2.1.2

- alternative search for projectId

### 2.1.0

- open project specified instead of dashboard

### 2.0.0

- removes deprecated jsnext:main from package.json
- Bundle all entry points with rollup [10](https://github.com/locize/locize-editor/pull/10)
- **note:** dist/es -> dist/esm, dist/commonjs -> dist/cjs (individual files -> one bundled file)
- removes bower finally

### v1.7.0

- allow setting lngOverride via init options as alternative to querystring [8](https://github.com/locize/locize-editor/pull/8)

### v1.6.3

- ignore ignorelocizeeditor: another instance [7](https://github.com/locize/locize-editor/pull/7)

### v1.6.2

- click handler: make ignorelocizeeditor elements clickable again [6](https://github.com/locize/locize-editor/pull/6)

### v1.6.1

- click event handler: prioritize over existing dom click events [5](https://github.com/locize/locize-editor/pull/5)

### v1.6.0

- option to trigger rerender on locize saved segments options.onEditorSaved: function(lng, ns) {}

### v1.5.1

- prevent link following [#4](https://github.com/locize/locize-editor/pull/4)

### v1.5.0

- support for input.placeholder

### v1.4.0

- standalone option to init without i18next usage

### v1.3.0

- read namespace from data-i18next-ns or i18next-ns too

### v1.2.0

- read namespace from data-i18next-options too

### v1.1.0

- enables listening to editor keypress on iframe - to toggle on/off while focus is on the iframe

### v1.0.0

- optimize z-index

### v0.12.0

- override lng with qs param useLng (useful for cimode usage)
- preventDefault on clicked element avoiding href navigation
- toggle on/off by keyboard ctrl+x (customizable)

### v0.11.0

- adds new default mode 'iframe', mode could be toggled by ?locizeMode=tab or setting mode on editor options

### v0.10.1

- replace cimode lng to referenceLng

### v0.10.0

- fixes autoOpen false
- removes html comments from detectable (enables usage eg. for react apps)
- remove namespace from submitted token

### v0.9.1

- adapt module.type change in i18next

### v0.9.0

- editor UI to toggle on/off
- enable by qs

### v0.0.1

- initial version
