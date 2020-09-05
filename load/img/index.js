const file = require('fs');
const util = require('util');
//
const readFile = util.promisify(file.readFile);

function imgLoaderModule() {
  /*
   */
  async function png(query) {
    const filename = query.substring(1);
    let content = readFile(`./rsc/img/${filename}`)
      .then(console.log(`Loaded img ${filename}`));
    content = await content;
    return content;
  }

  return {
    png,
  };
}

module.exports = imgLoaderModule;
