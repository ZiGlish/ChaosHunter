const file = require('fs');
const util = require('util');
const csv = require('csv-parser');
//
const readFile = util.promisify(file.readFile);

/* home loader module:
 * Responsible for on-demand load of the home page components.
 */
function homeLoaderModule(common) {
  const tab = '  ';
  function ws(i) {
    return tab.repeat(i);
  }
  /* writeWeaponSpan(string name, int cost, int size, string ammo, string needs, bool dual)
   * helper for readWeaponData. writes the span(s) for select buttons
   */
  function writeWeaponSpan(name, cost, size, ammo, needs, dual, imgname) {
    const dualspan = dual && size !== 1;
    const icon = dualspan ? '2' : '⇌';
    let output = dualspan ? `${ws(6)}<td class="enabled" onclick="togglePair('${needs}', '${name}', true)">` : `${ws(6)}<td>`;
    output += `<span \
id="${name}"
class="select-button weapon-selector" \
data-section="weapons" \
data-cost="${cost}" \
data-size="${size}" \
data-ammo="${ammo}" \
data-need="${needs}" \
data-dual="${dualspan}" \
data-file="${imgname}" \
data-state="true" >${icon}</span></td>\n`;
    // Recurse on Akimbo Weapons
    if (dual && !dualspan) {
      output += writeWeaponSpan(`Akimbo ${name}`, cost * 2, 2, ammo, name, dual, 'dual.png');
    } else if (!dualspan) { output += '            <td class="disabled"></td>\n'; }
    return output;
  }
  /* writeWeaponRow(string name, int cost, int size, string ammo, string needs, bool dual)
   * helper for readWeaponData, writes the HTML for a row of the weapon-list table
   */
  function writeWeaponRow(name, cost, size, ammo, needs, dual, imgname) {
    let output = dual ? `${ws(5)}<tr onclick="togglePair('${name}', 'Akimbo ${name}', false)">\n` : `${ws(5)}<tr onclick="toggle('${name}')">\n`;
    output += writeWeaponSpan(name, cost, size, ammo, needs, dual, imgname);
    output += `${ws(6)}<td>${name}</td>\n${ws(6)}<td>$${cost}</td>\n<td></td>\n`;
    output += `${ws(5)}</tr>`;

    return output;
  }
  /*

  */
  async function readWeaponData() {
    const stream = file.createReadStream('./rsc/home/weapons/data.csv').pipe(csv());
    let tableHtml = '';
    for await (const row of stream) {
      tableHtml += writeWeaponRow(row.name, parseInt(row.cost, 10), parseInt(row.size, 10), row.ammo, row.requires, row.akimbo.toLowerCase() === 'true', row.img);
    }
    return `${tableHtml} \t</table>\n\t</div>\n`;
  }
  /* readConsumableData():
   *
   */
  async function readConsumableData() {
    const stream = file.createReadStream('./rsc/home/consumables/data.csv').pipe(csv());
    let tableHtml = '';
    for await (const row of stream) {
      tableHtml += `${ws(5)}<tr onclick="toggle('${row.name}')">\
${ws(6)}<td><span id="${row.name}" \
class="select-button item-selector" \
data-section="consumables" \
data-cost="${row.cost}" \
data-file="${row.img}" \
data-state="true" >⇌</span></td>\n\
${ws(6)}<td>${row.name}</td>\n\
${ws(6)}<td>${row.cost}</td>\n\
${ws(6)}<td></td>\
${ws(5)}</tr>`;
    }
    return `${tableHtml} \t</table>\n\t</div>\n`;
  }
  /* readToolData():
   *
   */
  async function readToolData() {
    const stream = file.createReadStream('./rsc/home/tools/data.csv').pipe(csv());
    let tableHtml = '';
    for await (const row of stream) {
      tableHtml += `${ws(5)}<tr onclick="toggle('${row.name}')">\n\
${ws(6)}<td><span id="${row.name}" \
class="select-button tool-selector" \
data-section="tools" \
data-cost="${row.cost}" \
data-file="${row.img}" \
data-state="true" >⇌</span></td>\n\
${ws(6)}<td>${row.name}</td>\n\
${ws(6)}<td>${row.cost}</td>\n\
${ws(6)}<td></td>\
${ws(5)}</tr>`;
    }
    return `${tableHtml} \t</table>\n\t</div>\n`;
  }
  /* bootstrap:
      Performs server start-up functionality
  */
  async function html(query) {
    // Load the Page Header
    const pagehead = readFile('./rsc/home/header.html', 'utf8')
      .then(console.log('Loaded home header'));
    // Load the Weapons data from CSV, header from template
    const weaphead = readFile('./rsc/home/weapons/header.html', 'utf8')
      .then(console.log('Loaded weapons table header for home'));
    // Load weapon table body
    const weapbody = readWeaponData()
      .then(console.log('Loaded weapons table body for home'));
    // Load the Weapons data from CSV, header from template
    const toolhead = readFile('./rsc/home/tools/header.html', 'utf8')
      .then(console.log('Loaded tools table header for home'));
    // Load weapon table body
    const toolbody = readToolData()
      .then(console.log('Loaded tools table body for home'));
    // Load the Weapons data from CSV, header from template
    const conshead = readFile('./rsc/home/consumables/header.html', 'utf8')
      .then(console.log('Loaded consumables table header for home'));
    // Load weapon table body
    const consbody = readConsumableData()
      .then(console.log('Loaded consumables table body for home'));
    // Load the page footer
    const pagefoot = readFile('./rsc/home/footer.html', 'utf8')
      .then(console.log('Loaded home footer'));

    let out = await pagehead;
    out += await weaphead;
    out += await weapbody;
    out += await toolhead;
    out += await toolbody;
    out += await conshead;
    out += await consbody;
    out += await pagefoot;

    console.log('Loaded home');
    return out;
  }
  /*
   */
  const scripts = {
    '?common': './rsc/common.js',
    '?home': './rsc/home/script.js',
  };
  async function js(query) {
    const path = scripts[query];
    let content = readFile(path, 'utf8')
      .then(console.log('Loaded home js'));
    content = await content;
    return content;
  }
  async function css(query) {
    let content = readFile('./rsc/home/style.css', 'utf8')
      .then(console.log('Loaded home css'));
    content = await content;
    return content;
  }
  async function font(query) {
    let content = readFile('./rsc/font.otf')
      .then(console.log('Loaded home font'));
    content = await content;
    return content;
  }
  async function ico(query) {
    let content = readFile('./rsc/favicon.ico')
      .then(console.log('Loaded home icon'));
    content = await content;
    return content;
  }

  return {
    html,
    css,
    font,
    js,
    ico,
  };
}

module.exports = homeLoaderModule;
