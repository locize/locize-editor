const baseBtn = 'font-family: "Helvetica", "Arial", sans-serif; font-size: 14px; color: #fff; border: none; font-weight: 300; height: 30px; line-height: 30px; padding: 0; text-align: center; min-width: 90px; text-decoration: none; text-transform: uppercase; text-overflow: ellipsis; white-space: nowrap; outline: none; cursor: pointer;';

export function initUI(on, off, options) {
  const cont =  document.createElement("div");
  cont.setAttribute('style', 'z-index: 2147483647; font-family: "Helvetica", "Arial", sans-serif; position: fixed; bottom: 20px; right: 20px; padding: 10px; background-color: #fff; border: solid 1px #1976d2; box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);');
  cont.setAttribute('ignorelocizeeditor', '');
  cont.setAttribute('translated', '');

  const title = document.createElement("h4");
  title.id = "locize-title";
  title.innerHTML = "locize editor";
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

  document.body.appendChild(cont);

  const toggle = (on) => {
    turnOff.style.display = on ? 'block' : 'none';
    turnOn.style.display = !on ? 'block' : 'none';
  }

  return toggle;
}

export function appendIframe(url, options) {
  const cont =  document.createElement("div");
  cont.setAttribute('style', options.iframeContainerStyle);
  cont.setAttribute('ignorelocizeeditor', '');
  cont.setAttribute('translated', '');

  const iframe =  document.createElement("iframe");
  iframe.setAttribute('style', options.iframeStyle);
  iframe.setAttribute('ignorelocizeeditor', '');
  iframe.setAttribute('translated', '');
  iframe.setAttribute('src', url);
  cont.appendChild(iframe);

  document.body.appendChild(cont);
  const bodyStyle = document.body.getAttribute('style');
  document.body.setAttribute('style', `${bodyStyle}; ${options.bodyStyle}`);
  return iframe.contentWindow;
}
