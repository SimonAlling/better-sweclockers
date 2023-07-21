javascript:(() => {
"use strict";
const stringify = caught => caught instanceof Error ? caught.message : String(caught);
fetch("https://simonalling.github.io/better-sweclockers/better-sweclockers.user.js")
  .then(response => response.text())
  .then(code => {
    const e = document.createElement("script");
    e.textContent = "'use strict';" + code;
    document.body.appendChild(e);
  })
  .catch(caught => alert("Could not run Better SweClockers. Reason: " + stringify(caught)));
})()
