/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

function showJsonFromGit(url, emId, height) {
  fetch(url)
  .then(res => res.text())
  .then((out) => {
    if(emId != 'undefined') {
      document.getElementById(emId).style.height = height;
    }
    document.getElementById(emId).innerText = out
  })
  .catch(err => { throw err });
}
