
/* 
 * Comment handling functions:
 *
 * Based on (completely & shamelessly copy-pasted from):
 * https://stackoverflow.com/questions/13363946/how-do-i-get-an-html-comment-with-javascript
 *
 * Promise I up-voted the best answer.
 */
 function filterNone() {
 	return NodeFilter.FILTER_ACCEPT;
 }

 function getAllComments(rootElem) {
 	var comments = [];
    // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
    var iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_COMMENT, filterNone, false);
    var curNode;
    while (curNode = iterator.nextNode()) {
    	comments.push(curNode.nodeValue);
    }
    return comments;
}

/* UI Functions */
function htmlTextToDom(html) {
	var parser = new DOMParser();
	return parser.parseFromString(html, 'text/html');
}

function clearList(ul) {
	ul.innerHTML = "";
}

function fillListWithArray(ul, arr) {

	arr.forEach(ele => {
		var li = document.createElement("li");

		// The following is gross and redundant, I'm aware.
		// Keeping it separated for now since I'm debating how
		// to display different things. 
		console.debug(ele);
		if (typeof ele === 'string') {
			if (!ele.trim()) {
				return; // don't append empty text
			}
			var pre = document.createElement("pre");
			pre.appendChild(document.createTextNode(ele));
			li.appendChild(pre);
		} else if (typeof ele === 'object') {
			var jsonStr = JSON.stringify(ele);
			li.appendChild(document.createTextNode(jsonStr));
		} else {
			var jsonStr = JSON.stringify(ele);
			li.appendChild(document.createTextNode(jsonStr));
		}

		ul.appendChild(li);
	});
}

function setCommentsList(commentUL, root) {
	var comments = getAllComments(root);
	fillListWithArray(commentUL, comments);
}

function setConsoleLogList(consoleUL, logs) {
	fillListWithArray(consoleUL, logs);
}

function updateHtmlCommentsUI(response) {
	console.debug("Response:")
	console.debug(response);

	var commentUL = document.getElementById('html-comments');
	clearList(commentUL);

	if (response.success) {
		// Digest response
		var html = response.data.html;
		var root = htmlTextToDom(html)
		setCommentsList(commentUL, root);
	} else {
		commentUL.innerText = 'There was a communication error: \n' + response.error.message;
	}
}

function updateConsoleLogUI(response) {
	console.debug("Response:")
	console.debug(response);

	var consoleUL = document.getElementById('console-logs');
	clearList(consoleUL);

	if (response.success) {
		// Digest response
		var logs = response.data.logs;
		setConsoleLogList(consoleUL, logs);
	} else {
		consoleUL.innerText = 'There was a communication error: \n' + response.error.message;
	}
}

function refreshUI() {
	requestHtmlFromActiveTab(updateHtmlCommentsUI);
	var requestConsole = true; // TODO: Make this a preference using storage.
	if (requestConsole) {
		requestConsoleLogFromActiveTab(updateConsoleLogUI);
	}
};

/* UI Setup 01 */
window.onload = refreshUI;

let refresh = document.getElementById('refresh');
refresh.onclick = refreshUI;