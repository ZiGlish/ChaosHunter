/*
 *
 */
function homeApiModule(common) {
  // Homepage
  function generic(format) {
    return (content, response) => {
      response.writeHead(200, {
        'Content-Type': format,
      });
      common.sendResponse(response, content, 200);
    };
  }

  return {
    html: generic('text/html'),
    css: generic('text/css'),
    font: generic('font/otf'),
    js: generic('text/javascript'),
    ico: generic('image/x-icon'),
  };
}

module.exports = homeApiModule;
