/* Common Javascript
 */

/* collapse(button obj):
 * Logic for the collapsible buttons
 * and their corresponding fields.
 */
function collapse(obj) {
  obj.classList.toggle('active');
  const span = obj.children[0];
  span.innerHTML = obj.classList.contains('active') ? '▶' : '▷';
  const content = obj.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
}
/* get(string id)
  */
function get(id, att = null) {
  // Get Element by ID or Class if no Id with that name exists
  const obj = typeof id !== 'string' ? id : false
    || document.getElementById(id)
    || document.getElementsByClassName(id);
  let out = obj;
  if (att) {
    out = out.getAttribute(att);
    out = parseInt(out, 10) || out === 'true' || (out === 'false' ? false : out);
    if (out === '0') { out = 0; }
  }
  return out;
}
