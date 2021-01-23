function requestHtmlFromActiveTab(cb) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		request = { action: "HtmlAnalyzer::RequestHtml" };
		chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
			if (response) {
				msg = {success: true, data: response};
			} else {
				msg = {success: false, error: chrome.runtime.lastError};
			}
			cb(msg);
		});
	});
}

function requestConsoleLogFromActiveTab(cb) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		request = { action: "HtmlAnalyzer::RequestConsoleLogs" };
		chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
			if (response) {
				msg = {success: true, data: response};
			} else {
				msg = {success: false, error: chrome.runtime.lastError};
			}
			cb(msg);
		});
	});
}