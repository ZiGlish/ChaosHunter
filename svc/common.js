/* The Common Module
 * Contains functions used by mulriple other modules.
 */
function commonModule() {
  /* sanitize(string input)
   * Weapon Name sanitization function.
   */
  function sanitize(input) {
    return input.replace(/ /g, '-');
  };
  /* sendResponse(obj response, string content, int status)
   * Utility function for sending responses to the client.
   */
  function sendResponse(response, content, status) {
    response.statusCode = status;
    response.end(content);
  }
  /* sendRedirect(string destination)
   * Utility function for redirecting an endpoint to the given destination.
   */
  function sendRedirect(destination) {
    return (content, response) => {
      response.writeHead(302, {
        Location: destination,
      });
      sendResponse(response, content, 302);
    };
  }
  // Return the module object.
  return {
    sanitize,
    sendResponse,
    sendRedirect,
  };
}
// EXPORT the module function.
module.exports = commonModule;
