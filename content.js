/*
 * Capture console.log in case website shows anything interesting in the console.
 * Medium.com for example links a job application from the console.
 *
 * Since chrome extension content_scripts operate in their "own world" a small
 * bit of JS must be injected into the parent page to capture the console logs.
 *
 * Based on:
 * https://stackoverflow.com/questions/19846078/how-to-read-from-chromes-console-in-javascript
 * https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
 */

//
function setupConsoleCapture() {
	var script = document.createElement('script');
	script.src = chrome.runtime.getURL('html-analyzer-helper.js');
	script.onload = function() {
		// FIXME: this.remove();
	};
	(document.head || document.documentElement).prepend(script);
}

setupConsoleCapture();

// Listen for requests
function getTimestamp() {
	var date = new Date();
	return date.getTime();
}

function requestConsoleLogs(sendResponse) {
	// Set up communication between content.js and webpage
	window.addEventListener("message", function(event) {
	  // We only accept messages from ourselves
	  console.debug(event);
	  if (event.source != window) {
	  	return;
	  }

	  if (event.data.action && (event.data.action == "HtmlAnalyzer::ReplyConsoleLogs")) {
	  	var logs = event.data.logs;
	  	console.debug("Reply with console logs: ");
	  	console.debug(logs);
	  	sendResponse({ time: getTimestamp(), logs : logs });
	  }
	}, false);
	window.postMessage({action: "HtmlAnalyzer::RequestConsoleLogs"}, "*");
}

/*
 * These listeners receive requests from messages.js, dispatch to the main page,
 * and reply to messages.js.
 */
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 	if(request) {
 		if (request.action == "HtmlAnalyzer::RequestHtml") {
 			var html = document.documentElement.outerHTML;
 			sendResponse({ time: getTimestamp(), html: html });
 		}

 		if (request.action == "HtmlAnalyzer::RequestConsoleLogs") {
 			requestConsoleLogs(sendResponse); // Need to ping main page and listen for reply.
 			return true; // keep connection open while we wait.
 		}
 	}
 });