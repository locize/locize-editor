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
