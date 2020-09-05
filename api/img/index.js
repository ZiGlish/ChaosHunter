function imgApiModule(common) {
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
    png: generic('image/png'),
  };
}

module.exports = imgApiModule;
