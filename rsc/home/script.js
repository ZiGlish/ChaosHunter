/* toggle(string name):
  toggles the state the object with the given id.
*/
function toggle(name) {
  const btn = get(name);
  const state = get(btn, 'data-state');
  btn.setAttribute('data-state', !state);
}
/* toggleWeapon(string weapon, bool paired):
 * Manages the toggle behavior for active checkboxes,
 * must be able to handle redundant calls. paired variable used to achieve this.
 */
function togglePair(weapon, paired, inner) {
  const w = get(weapon);
  const p = get(paired);
  if (inner) {
    p.setAttribute('data-state', !get(p, 'data-state'));
    w.setAttribute('data-state', false);
  } else {
    const state = get(w, 'data-state');
    w.setAttribute('data-state', !state);
    if (state) { p.setAttribute('data-state', false); }
  }
}
/* toggleGroup(checkbox, filter)
 * Manages the group toggles used by the weapon list
 */
function toggleGroup(checkbox, filterFn) {
  const weapons = get('weapon-selector');
  const state = get(checkbox, 'data-state');
  checkbox.setAttribute('data-state', !state);
  checkbox.innerHTML = checkbox.innerHTML.replace(/[◎◉]/, state ? '◎' : '◉');
  checkbox.innerHTML = checkbox.innerHTML.replace(/(ON|OFF)/, state ? 'ON' : 'OFF');
  for (let i = 0; i < weapons.length; i += 1) {
    const weapon = weapons[i];
    if (filterFn(weapon)) { weapon.setAttribute('data-state', !state); }
  }
}
/* onPageResize(bool qm)
 * run on page resize. Manages margins around result columns
 */
function onResize(qm) {
  const w = qm ? 375 : 300;
  return () => {
    const width = window.innerWidth;
    const columns = get('results-column');
    if (width < 750) {
      for (let i = 0; i < columns.length; i += 1) {
        columns[i].style = 'width: 300px; margin-left: calc(50% - 150px); margin-right: calc(50% - 150px); float: none;';
      }
    } else if (width < 1110) {
      columns[0].style = 'width: 300px; margin-left: calc(50% - 150px); margin-right: calc(50% - 150px); float: none;';
      columns[1].style = 'width: 300px; margin-left: calc(50% - 320px); margin-right: 10px; float: left;';
      columns[2].style = 'width: 300px; margin-left: 10px; margin-right: calc(50% - 320px); float: left;';
    } else {
      columns[0].style = `width: ${w}px; margin-left: calc(50% - ${w + 142.5}px); margin-right: 15px; float: left;`;
      columns[1].style = 'width: 300px; margin-left: 15px; margin-right: 15px; float: left;';
      columns[2].style = `width: 300px; margin-left: 15px; margin-right: calc(40% - ${w + 142.5}px); float: left;`;
    }
  };
}
window.onresize = onResize(false);
/* genOnSlider(string name):
 * the on-change behavior for the tools and consumables lock sliders
 */
function genOnSlider(name) {
  return () => {
    const spans = get(`${name}-lock`);
    const titles = get(`${name}-title`);
    const costs = get(`${name}-cost`);
    const icons = get(`${name}-icon`);
    const self = get(`${name}-slider`);
    const value = parseInt(self.value, 10);
    const ammos = get(`${name}-ammo`);
    for (let i = value; i < get(self, 'max'); i += 1) {
      spans[i].innerHTML = '';
    }
    for (let i = value; i > 0; i -= 1) {
      spans[i - 1].innerHTML = '<img src="/img?lock.png">';
      icons[i - 1].children[0].src = '/img?blank-1.png';
      icons[i - 1].colSpan = 1;
      titles[i - 1].innerHTML = '<span data-cost="0" data-size="1">None</span>';
      titles[i - 1].colSpan = 1;
      costs[i - 1].innerHTML = '$0';
      if (ammos[0]) {
        ammos[i - 1].innerHTML = 'No Ammo';
      }
    }
  };
}
/* chaos
 * The logic for the roll button
 */
async function chaos() {
  let cost = 0;
  const qm = get('option-qm', 'data-state');
  let slots = qm ? 5 : 4;
  const optionFill = get('option-fill', 'data-state');
  const optionDupWeap = get('option-dupWeap', 'data-state');
  const optionDupItem = get('option-dupItem', 'data-state');
  // Setup the result variables with weapons
  let list = get('weapon-selector');
  let range = get('weapon-slider');
  let titles = get('weapon-title');
  let icons = get('weapon-icon');
  let costs = get('weapon-cost');
  const ammos = get('weapon-ammo');
  // Grab and clear the error output
  const errorHead = get('error-header');
  const errorBody = get('error-output');
  errorHead.innerHTML = '';
  errorBody.innerHTML = '';

  let item;
  let r;
  // Handles the randomization of an item
  function helperRandom(dups = false, weaps = false) {
    const f = (x) => (!optionFill && get(x, 'data-size') <= slots) || get(x, 'data-size') === slots;
    // Handles Locked Item slots
    for (let i = 0; i < parseInt(range.value, 10); i += 1) {
      cost += get(titles[i], 'data-cost');
      slots -= get(titles[i], 'data-size');
      if (weaps) {
        ammos[i].innerHTML = 'No Ammo';
        slots -= 1;
        list = list.filter(f);
      }
    }
    // Handles unlocked item slots
    for (let i = parseInt(range.value, 10); i < get(range, 'max'); i += 1) {
      if (list.length > 0) {
        // Select Random Item
        r = Math.floor(Math.random() * list.length);
        item = list[r];
        // Remove Duplicate
        if (!dups) { list.splice(r, 1); }
        // Adjust Slots and Cost
        const size = get(item, 'data-size') || 1;
        const itemCost = get(item, 'data-cost') || 0;
        slots -= size;
        cost += itemCost;
        // Update Results Table
        titles[i].innerHTML = item.outerHTML;
        titles[i].children[0].id = '';
        titles[i].children[0].innerHTML = item.id;
        titles[i].children[0].classList = [];
        icons[i].children[0].src = `/img?${get(item, 'data-file')}`;
        icons[i].colSpan = size;
        costs[i].innerHTML = `$${itemCost}`;
        if (weaps) {
          const ammo = get(item, 'data-ammo');
          ammos[i].innerHTML = `${ammo} Ammo`;
          titles[i].colSpan = size;
          list = list.filter(f);
        }
      } else {
        titles[i].innerHTML = '<span>None</span>';
        icons[i].children[0].src = '/img?blank-1.png';
        icons[i].colSpan = 1;
        costs[i].innerHTML = '$0';
        if (!weaps) {
          errorHead.innerHTML = 'Error:';
          errorBody.innerHTML += 'Not enough items available to fill all slots\n';
          errorBody.innerHTML += ' * Try turning on more tools & consumables\n';
          if (!optionDupItem) {
            errorBody.innerHTML += ' * Try turning on duplicates\n';
          }
        } else if (optionFill) {
          errorHead.innerHTML = 'Error:';
          errorBody.innerHTML += 'No weapon options able to fill all slots\n';
          errorBody.innerHTML += ' * Try turning off fill all\n';
          if (qm) {
            errorBody.innerHTML += ' * Try turning off quartermaster\n';
          } else if (weaps && slots === 2 && !optionDupWeap) {
            errorBody.innerHTML += ' * Try turning on duplicates\n';
          }
          if (slots > 3) {
            errorBody.innerHTML += ' * Try turning on some weapons\n';
          } else {
            let word;
            if (slots === 1) {
              word = 'small';
            } else if (slots === 2) {
              word = 'medium';
            } else { word = 'large'; }
            errorBody.innerHTML += ` * Try turning on more ${word} weapons\n`;
          }
        }
      }
    }
  }
  // Main function body
  list = [...list].filter(
    (x) => (
      (slots === 4
        || !optionFill
        || get(x, 'data-size') !== 1)
      && get(x, 'data-state')),
  );
  helperRandom(optionDupWeap, true);
  slots = 4;
  // Tools
  list = [...get('tool-selector')].filter((x) => get(x, 'data-state'));
  range = get('tool-slider');
  titles = get('tool-title');
  icons = get('tool-icon');
  costs = get('tool-cost');
  helperRandom();
  slots = 4;
  // Options
  list = [...get('item-selector')].filter((x) => get(x, 'data-state'));
  range = get('item-slider');
  titles = get('item-title');
  icons = get('item-icon');
  costs = get('item-cost');
  helperRandom(optionDupItem);
  // Page Resize
  window.onresize = onResize(qm);
  onResize(qm)();
}
