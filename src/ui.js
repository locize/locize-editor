const baseBtn = 'font-family: "Helvetica", "Arial", sans-serif; font-size: 14px; color: #fff; border: none; font-weight: 300; height: 30px; line-height: 30px; padding: 0; text-align: center; min-width: 90px; text-decoration: none; text-transform: uppercase; text-overflow: ellipsis; white-space: nowrap; outline: none; cursor: pointer;';

export function initUI(on, off, options) {
  const cont =  document.createElement("div");
  let style = 'font-family: "Helvetica", "Arial", sans-serif; bottom: 20px; right: 20px; padding: 10px; background-color: #fff; border: solid 1px #1976d2; box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);';
  if(options.locizeEditorToggle.appendTarget) {
    style += 'position: absolute;';
  } else {
    style += ' z-index: 2147483647; position: fixed;';
  }
  cont.setAttribute('style', style);
  cont.setAttribute('ignorelocizeeditor', '');
  cont.setAttribute('translated', '');
  if(options.locizeEditorToggle.containerClasses) {
    const classes = options.locizeEditorToggle.containerClasses.length > 1 ? options.locizeEditorToggle.containerClasses.split(' ') : options.locizeEditorToggle.containerClasses;
    classes.forEach(function(cssClass) {
      cont.classList.add(cssClass);
    });
  }

  const title = document.createElement("h4");

  title.id = "locize-title";
  title.innerHTML = options.locizeEditorToggle.title || "locize editor";
  title.setAttribute('style', 'font-family: "Helvetica", "Arial", sans-serif; font-size: 14px; margin: 0 0 5px 0; color: #1976d2; font-weight: 300;')
  title.setAttribute('ignorelocizeeditor', '');
  cont.appendChild(title);

  const turnOff =  document.createElement("button");
  turnOff.innerHTML = "On";
  turnOff.setAttribute('style', `${baseBtn} display: none; background-color: #54A229;`)
  turnOff.onclick = off;
  turnOff.setAttribute('ignorelocizeeditor', '');
  cont.appendChild(turnOff);

  const turnOn =  document.createElement("button");
  turnOn.innerHTML = "Off";
  turnOn.setAttribute('style', `${baseBtn} display: none; background-color: #D50000;`)
  turnOn.onclick = on;
  turnOn.setAttribute('ignorelocizeeditor', '');
  cont.appendChild(turnOn);

  if(options.locizeEditorToggle.appendTarget) {
    options.locizeEditorToggle.appendTarget.appendChild(cont);
  } else {
    document.body.appendChild(cont);
  }

  const toggle = (on) => {
    turnOff.style.display = on ? 'block' : 'none';
    turnOn.style.display = !on ? 'block' : 'none';
  }

  return toggle;
}

export function appendIframe(url, options) {
  if(options.locizeEditorWindow.appendTarget) {
    options.iframeContainerStyle = 'position: absolute; top: 0; right: 0; bottom: 0; left: 0;';
    options.iframeStyle += ' width: 100%;';
  }
  const cont =  document.createElement("div");
  cont.setAttribute('style', options.iframeContainerStyle);
  cont.setAttribute('ignorelocizeeditor', '');
  cont.setAttribute('translated', '');
  if(options.locizeEditorWindow.containerClasses) {
    const classes = options.locizeEditorWindow.containerClasses.length > 1 ? options.locizeEditorWindow.containerClasses.split(' ') : options.locizeEditorWindow.containerClasses;
    classes.forEach(function(cssClass) {
      cont.classList.add(cssClass);
    });
  }

  const iframe =  document.createElement("iframe");
  iframe.setAttribute('style', options.iframeStyle);
  iframe.setAttribute('ignorelocizeeditor', '');
  iframe.setAttribute('translated', '');
  iframe.setAttribute('src', url);
  cont.appendChild(iframe);
  if(options.locizeEditorWindow.appendTarget) {
    options.locizeEditorWindow.appendTarget.appendChild(cont);
  } else {
    document.body.appendChild(cont);
    const bodyStyle = document.body.getAttribute('style');
    document.body.setAttribute('style', "".concat(bodyStyle, "; ").concat(options.bodyStyle));
  }
  return iframe.contentWindow;
}
