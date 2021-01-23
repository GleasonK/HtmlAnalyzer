/*
 * This code is inserted by HTML Analyzer to help logging
 * functions.
 *
 * If you would not like for this code insertion to occur,
 * it can be turned off in the HTML Analyzer extension
 * popup window. Disable "Console Capture".
 */

// Setup console capture
console.stdlog = console.log.bind(console);
console.logs = [];
console.log = function(){
	Array.from(arguments).forEach(ele => console.logs.push(ele));
	console.stdlog.apply(console, arguments);
}
console.debug("[HTML Analyzer]: Setup console capture.");

// Set up communication between content.js and webpage

/*
 * This listener receives messages from content.js and replies back to
 * content.js.
 */
window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  console.debug(event);
  if (event.source != window) {
  	return;
  }

  if (event.data.action && (event.data.action == "HtmlAnalyzer::RequestConsoleLogs")) {
  	var logs = console.logs;
  	var logsNoMethods = JSON.parse(JSON.stringify(logs)); // if object is printed to console, need to remove methods
  	console.debug("Request for console logs: ");
  	console.debug(logsNoMethods);
  	window.postMessage({action: "HtmlAnalyzer::ReplyConsoleLogs", logs: logsNoMethods }, "*");
  }
}, false);