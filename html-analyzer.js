function toDom(html){
	// FIXME: this is awful practice I'm sure.
	let doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.firstChild;
}

function isHTML(str) {
  // https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/15458987
  let doc = new DOMParser().parseFromString(str, 'text/html');
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

class HtmlAnalysis {
	constructor() {}

 	toHtml() { // Is there no better way to do this in JS?
 		throw new Error("Abstract method!");
 	}

 	writeTo(element, ul) {
 		let html = this.toHtml();
 		if (html){
 			if (html instanceof HTMLElement) {
 				element.appendChild(html);
 			} else {
 				element.innerHTML = html;
 			}
 			ul.appendChild(element);
 		}
 	}
 };

 class Data extends HtmlAnalysis {
 	constructor(data) {
 		super();
 		this.data = data;
 	}
 	toHtml() {
 		let dataStr = this.data;
 		if (this.data instanceof Object){
	 		dataStr = JSON.stringify(this.data);
 		}
 		return `<pre>${dataStr}</pre>`
 	}
 };

 class ImageAnalyzer extends HtmlAnalysis {
 	constructor(img) {
 		super();
 		this.image = img;
 	}
 	appendExifData(img, ul) { // only applies to jpg
 		if (img.complete) {
 			EXIF.getData(img, function() {
 					var allMetaData = EXIF.getAllTags(this);
 					let exif = JSON.stringify(allMetaData, null, "\t");
 					console.log(exif)
 					if (Object.keys(allMetaData).length != 0) {
 						fillListWithArray(ul, Object.entries(allMetaData).map(ele=>new Data(ele)));
		        	}
        });
 		} else {
 			console.log("EXIF error: Image not loaded.");
 		}
 	}
 	prependImage(html) {
 		let exif = html.getElementsByClassName("image-exif")[0];
 		const img = new Image();
 		img.onload = () => { 
 			this.appendExifData(img, exif);
 		}
 		img.src = this.image;
 		img.classList.add("image-img");
 		html.insertBefore(img, html.firstChild)
 		return html;
 	}
 	toHtml() {
 		if (this.image.startsWith("chrome-extension://")) {
 			return null;
 		}
 		let html = `
 		<div class="image-analysis">
	 		<div class="image-data">
	 			<pre>${this.image}</pre>
	 			<ul class="image-exif"></ul>
			</div>
 		</div>`;
 		return this.prependImage(toDom(html));
 	}
 };

 class Comment extends HtmlAnalysis{
 	constructor(cmt) {
 		super();
 		this.comment = cmt;
 	}
 	toHtml() {
 		let comment = this.comment.trim();
 		if (!comment) {
			return null; // don't append empty text
		}
		let pre = document.createElement("pre");
		if (isHTML(comment)) {
			pre.innerText = comment;
		} else {
			pre.innerHTML = comment;
		}
		return pre;
	}
};

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
    	comments.push(new Comment(curNode.nodeValue));
    }
    return comments;
 }

 function getAllImages(rootElem) {
 	var images = rootElem.getElementsByTagName('img');
 	var srcList = [];
 	for(var i = 0; i < images.length; i++) {
 		srcList.push(new ImageAnalyzer(images[i].src));
 	}
 	return srcList;
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
 		if (!ele) {
 			console.log("error")
 		}
 		ele.writeTo(li, ul);
 	});
 }

 function setImageList(imageUL, root) {
 	let images = getAllImages(root);
 	fillListWithArray(imageUL, images);
 }

 function setCommentsList(commentUL, root) {
 	var comments = getAllComments(root);
 	fillListWithArray(commentUL, comments);
 }

 function setConsoleLogList(consoleUL, logs) {
 	fillListWithArray(consoleUL, logs);
 }

 function updateHtmlAnalysis(response) {
 	let commentUL = document.getElementById('html-comments');
 	let imageUL = document.getElementById('images-exif');
 	clearList(commentUL);
 	clearList(imageUL);

 	if (response.success) {
		// Digest response
		var html = response.data.html;
		var root = htmlTextToDom(html)
		setCommentsList(commentUL, root);
		setImageList(imageUL, root);
	} else {
		commentUL.innerText = 'There was a communication error: \n' + response.error.message;
	}
}

function updateConsoleLogUI(response) {
	var consoleUL = document.getElementById('console-logs');
	clearList(consoleUL);

	if (response.success) {
		// Digest response
		var logs = response.data.logs.map((log) => new Data(log));
		setConsoleLogList(consoleUL, logs);
	} else {
		consoleUL.innerText = 'There was a communication error: \n' + response.error.message;
	}
}

function refreshUI() {
	requestHtmlFromActiveTab(updateHtmlAnalysis);
	var requestConsole = true; // TODO: Make this a preference using storage.
	if (requestConsole) {
		requestConsoleLogFromActiveTab(updateConsoleLogUI);
	}
};

/* UI Setup 01 */
window.onload = refreshUI;

let refresh = document.getElementById('refresh');
refresh.onclick = refreshUI;