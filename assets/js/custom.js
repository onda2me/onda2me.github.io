/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

function showJsonFromGit(url) {
  fetch(url)
  .then(res => res.text())
  .then((out) => {
  document.getElementById("show-json-from-git").innerText = out
  })
  .catch(err => { throw err });
}



