//Pollyfills
//isArray pollyFill:
if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
///Element.matches pollyFill
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}
////////

function argArray(args, propName) {
	if (propName && typeof propName === 'string') { args = args[propName] }
	if (args === undefined || false) return [];
	if (!isArray(args)) { args = [args]; }
	return args;
}

function defaultBlankObj(obj) {
	if (!isObj(obj)) { return {}; }
	return obj;
}

////////
function elCreator(tagN, txt, attrs) {
	var el = document.createElement(tagN);
	if (txt) {
		var text = document.createTextNode(txt);
		el.appendChild(text);
	}
	if (attrs) { el = addAttrs(el, attrs) }
	return el;
}

function addAttrs(el, attrs) {////updated/bugfix 9/19
	if (!el.tagName) { return; }
	var att, theProps, style;
	for (att in attrs) {
		if (att.toLowerCase().indexOf('_') > -1) {
			style = att.split('_');
			if (style.length === 2 && el[style[0]]) { el[style[0]][style[1]] = attrs[att]; }
			if (style.length === 3 && el[style[0]] && el[style[0]][style[1]]) { el[style[0]][style[1]][style[2]] = attrs[att]; }
		}
		else { el[att] = attrs[att]; }
	}
	return el;
}

//////////
function readVal(obj) { return (obj.tagName) ? obj.value : obj; }
////////////
function getParentNode(lvl, obj) {
	for (var i = 0; i < lvl; i++) { obj = obj.parentNode; }
	return obj;
}

//////////
function isNodeList(nodes) {
	var stringRepr = Object.prototype.toString.call(nodes);
	return typeof nodes === 'object' &&
		/^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
		(typeof nodes.length === 'number') &&
		(nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
}

///////
function getObjKeys(obj) {
	if (!isObj(obj)) { return []; }
	var keys = [];
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) { keys.push(k); }
	}
	return keys
}

////////////



function arrFromStr(strOrArr, sep) {
	if (typeof strOrArr === 'string') {
		sep = (typeof sep === 'string') ? sep : ',';
		return strOrArr.split(sep);
	}
	return strOrArr;
}

////////////
function elID(elID, within) {/// deprecate
	if (!within.tagName) { within = document; }
	if (typeof elID === 'string') { el = within.getElementById(elID); }
	return el;
}

function __id(id) { if (typeof id === 'string') { return document.getElementById(id); } }

function __Name(name, within) {
	if (within === undefined || !within.tagName) { within = document; }
	if (typeof name === 'string') { return within.getElementsByName(name); }
}

function __name(name, within) { var temp = __Name(name, within); return temp ? temp[0] : temp; }

function __Attr(val, within, args) {
	if (!within || !within.tagName) { within = document.body; }
	if (Object.prototype.toString.call(args) !== "[object Object]") { args = {}; }
	if (typeof args.attr !== 'string') { args.attr = 'value'; }
	if (typeof args.tag !== 'string') { args.tag = ''; }
	if (!Array.isArray(val)) { val = [val]; }
	var comm = '';
	var qstr = '';
	for (let i = 0, l = val.length; i < l; i++) {

		let eq = val[i] !== undefined ? (val[i].toString() !== '' ? '=' + val[i].toString() : '') : '';
		qstr += comm + args.tag + '[' + args.attr + eq + ']';
		comm = ',';
	}
	if (qstr === '') { qsr = args.tag + '[' + args.attr + ']'; }
	return within.querySelectorAll(qstr);
}

function __attr(val, within, args) { var temp = __Attr(val, within, args); return temp ? temp[0] : temp; }

////////////
function nodeIsWhat(obj, what) {
	what = (what === undefined || typeof what !== 'string') ? 'DIV' : what.toUpperCase();
	return (obj.nodeName && obj.nodeName === what);
}


function isHTMLelement(obj) { return (typeof obj !== 'undefined' && obj.nodeType === Node.ELEMENT_NODE); }

////////////
function isArrayLike(item) {
	return (
		Array.isArray(item) ||
		(!!item &&
			typeof item === "object" &&
			item.hasOwnProperty("length") &&
			typeof item.length === "number" &&
			item.length > 0 &&
			(item.length - 1) in item
		)
	);
}

///////////
function RM_iterator(arr, rev, loop, foo) {

	this.arr = arr;
	this.update = function () {
		if (typeof this.arr === "object") {
			this.keys = Object.keys(arr);
			this.val = [];
			for (var i = 0; i < this.keys.length; i++) { this.val[i] = this.arr[this.keys[i]]; }
		}
		else {
			this.keys = Array.apply(null, Array(this.arr.length)).map(function (_, i) { return i; });
			this.val = this.arr;
		}
		this.size = this.keys.length;
	}
	this.update();
	this.loop = loop;
	this.direction = rev ? -1 : 1;
	this.pointer = rev ? this.size : -1;

	this.getIndex = function (index) {
		if (index === undefined) { return this.current(false); }
		return this.arr[index];
	}
	this.random = function (returnKey) {
		var index = Math.floor(Math.random() * (this.arr.length + 1));
		return returnKey ? this.keys[index] : this.arr[this.keys[index]];
	}
	this.getKeys = function (index) {
		return this.keys;
	}
	this.getVals = function (index) {
		return this.val;
	}
	this.next = function (returnKey) {
		this.pointer += this.direction;
		this.loopCheck();
		return this.current(returnKey);
	}
	this.prev = function (returnKey) {
		this.pointer -= this.direction;
		this.loopCheck();
		return this.current(returnKey);
	}
	this.current = function (returnKey) {
		var index = (this.pointer === -1) ? 0 : this.pointer;
		index = (index === this.size) ? index - 1 : index;
		return returnKey ? this.keys[index] : this.arr[this.keys[index]];
	}
	this.doFoo = function (foo, start, end, increment) {///////?????
		var results = [];
		if (typeof foo === 'string') { foo = window[foo]; }
		if (!(foo instanceof Function)) { return results; }
		if (increment === undefined || !increment) { increment = 1; }
		increment = Math.abs(increment);
		if (start === undefined || start < 0) { start = 0; }
		if (start >= this.size) { start = this.size - 1; }
		if (end === undefined || end >= this.size) { end = this.size - 1 }
		if (end < 0) { end = 0; }
		var dir = (start < end) ? increment : -1 * increment;
		for (var i = start; (dir > 0 && i <= end) || (dir < 0 && i >= end); i = i + dir) {
			results[i] = foo.apply(this, Array.prototype.slice.call(arguments, 4).concat([i, this.arr[this.keys[i]], this.keys[i], this.size, dir]));
		}
		return results;
	}
	this.loopCheck = function () {
		if (!this.loop) { return; }
		if (this.direction > 0) {
			if (this.pointer >= this.size) { this.pointer = 0; }
		} else {
			if (this.pointer < 0) { this.pointer = this.size - 1; }
		}
	}
}

//////////
function withEls(selector, relRoot, fooToDo) {
	relRoot = (relRoot && relRoot.tagName) ? relRoot : document;
	var elements = relRoot.querySelectorAll(selector);
	if (fooToDo === undefined) { return elements; }
	if (fooToDo) {
		var tempArr = Array();
		if (arguments.length > 3) {
			for (var i = 3; i < arguments.length; i++) {
				tempArr[i - 2] = arguments[i];
			}
		}
		for (var i = 0; i < elements.length; i++) {
			tempArr[0] = elements[i];
			fooToDo(...tempArr);
		}
	}
}

/////
function addListener(el, eventName, eventHandler) {
	if (el.addEventListener) { el.addEventListener(eventName, eventHandler, false); }
	else if (el.attachEvent) { el.attachEvent('on' + eventName, eventHandler); }
}

/////////////


function AJAX(url, data, handler, method, ctyp, heds, cred) {				// ajax call: (URL, query data, form method,  response type)
	if (window.XMLHttpRequest) { var req = new XMLHttpRequest(); }
	else if (window.ActiveXObject) { var req = new ActiveXObject("Microsoft.XMLHTTP") }
	else { return false }
	if (typeof method == 'undefined') { method = "GET"; }
	method = method.toUpperCase();
	if (method != "POST") { method = "GET"; }
	url = (data && typeof data == 'string' && method == "GET") ? url + "?" + data : url;
	if (method == "POST" && isObj(data)) { data = JSON.stringify(data); }
	var dat = (method == "GET" || typeof data == 'undefined') ? null : data;    					///preps data to send, null for GET or undefined data, else data is passed as object
	//console.log(data);
	req.open(method, url, true);
	if (cred !== undefined) { req.withCredentials = cred ? true : false }
	//console.log(req.getAllResponseHeaders());

	//update 3-2018
	//sets requests headers
	if (isObj(heds)) {															// aditional headers
		var pair;
		//console.log(heds);
		for (pair in heds) {
			if (pair != "Content-Type") { req.setRequestHeader(pair, heds[pair]); }
		}
	}

	ctyp = (typeof ctyp != 'undefined') ? ctyp : "application/x-www-form-urlencoded";				//content-type OR default content type
	if (method == "POST") { req.setRequestHeader("Content-Type", ctyp); }///3-2018

	/////
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			var handerIsArr = isArray(handler);
			var handlerArgs = (handerIsArr && handler.length > 1) ? handler[1] : new Array();
			var handlerFoo = handerIsArr ? handler[0] : handler;
			handlerFoo.apply(req, handlerArgs);
		}
	}
	///
	req.send(dat);
}


function doAJAX(url, data, handler, method, handlerArgs, ctyp, doFail) {
	if (typeof handler === 'string') {
		if (window[handler] === undefined) { return false; }
		handler = window[handler];
	}
	if (window.XMLHttpRequest) { var req = new XMLHttpRequest(); }
	else if (window.ActiveXObject) { var req = new ActiveXObject("Microsoft.XMLHTTP") }
	else { return false }
	if (method === undefined || (method && (typeof method === 'string' && method.replace(/^\s+|\s+$/gm, ''.toUpperCase()) !== 'POST')) || (method && (typeof method !== 'string'))) { method = "GET"; }
	else { method = 'POST'; }
	url = (typeof data === 'string' && method === "GET") ? url + "?" + data : url;
	var dat = (method === "GET" || data === undefined) ? null : data;
	req.open(method, url, true);
	ctyp = (typeof ctyp !== 'string') ? ctyp : "application/x-www-form-urlencoded";
	if (method == "POST") { req.setRequestHeader("Content-type", ctyp); }
	req.send(dat);
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (handlerArgs !== undefined) {
				var arry = [req.responseText];
				if (isArray(handlerArgs)) { arry = arry.concat(handlerArgs); }
				else { arry.push(handlerArgs) }
			}
			if (req.status == 200) { handler.apply(this, arry); }
			else if (doFail) { doFail.apply(this, arry); }
		}
	}
}
///////////
function DOMparse(text, mime) {
	if (mime === "img") { mime = "image/svg+xml"; }
	else if (mime === "app") { mime = "application/xml"; }
	else if (mime === "xml") { mime = "text/xml"; }
	else { mime = "text/html"; }
	var xmlDoc = new DOMParser().parseFromString(text, mime);
	return xmlDoc;
}
////
function propDrill(el, prop) {
	var propObj = el;
	if (Array.isArray(prop)) {
		for (var i = 0, l = prop.length - 1; i < l; i++) {
			propObj = propObj[prop[i]];
		}
		propName = prop[l];
	}
	else { var propName = prop; }
	return { object: propObj, property: propName };
}
function setProp(el, prop, value) {
	var targetObj = propDrill(el, prop);
	targetObj.object[targetObj.property] = value;
}
function getProp(el, prop) {
	var targetObj = propDrill(el, prop);
	return targetObj.object[targetObj.property];
}
////  TOGGLES

function toggle(On, Off) {
	if (On === undefined) { On = true; }
	if (Off === undefined) { Off = false }
	this.On = On;
	this.Off = Off;
	this.toggleAt = false;
	this.checkToggle = function () {
		return (this.toggleAt) ? this.On : this.Off;
	}
	this.toggle = function () {
		this.toggleAt = !this.toggleAt;
		return this.checkToggle();
	}
}

function quickToggle(cPos, posOn, posOff) {
	if (posOn === undefined) { posOn = (cPos !== undefined && cPos) ? cPos : true; }
	if (posOff === undefined) { posOff = false; }
	return (posOn !== cPos) ? posOn : posOff;
}

function sbstrToggle(str, strOn, strOff, cond) {
	var str = ' ' + str + ' ';
	if (cond !== undefined) {
		if (cond) { addClss = strOn; }
		else { addClss = strOff; }
	} else {
		if (str.indexOf(' ' + strOff + ' ') > -1 || str.indexOf(' ' + strOn + ' ') < 0) { addClss = strOn; }
		else { addClss = strOff; }
	}
	str = str.replace(' ' + strOff + ' ', ' ');
	str = str.replace(' ' + strOn + ' ', ' ');
	str = str + ' ' + addClss;
	str.replace('  ', ' ');
	str.replace(/^\s+|\s+$/gm, '');
	return str;
}


function toggleClass_old(el, clss, togg) {
	if (typeof clss == typeof 'string') {
		togg = typeof togg == typeof 'string' ? RM_trim(togg) : togg;
		var theClassName = ' ' + el.className + ' ';
		var rgxStr = ' ' + clss + '(?= )';
		var rgx = new RegExp(rgxStr, "g");
		var isON = rgx.test(theClassName);
		var isSwap = (togg && typeof togg == typeof 'string');
		var replc;
		if (isON) {
			replc = isSwap ? ' ' + togg : ' ';
			theClassName = theClassName.replace(rgx, replc);
		}
		else {
			if (!isSwap || theClassName.indexOf(' ' + togg + ' ') < 0) { theClassName = theClassName + clss; }
			else {
				rgx = new RegExp(' ' + togg + '(?= )', "g");
				theClassName = theClassName.replace(rgx, ' ' + clss);
			}
		}
		theClassName = RM_trim(theClassName);
		el.className = theClassName;
	}
}


function toggleClass(element, theClass, altClass) {
	if (element.classList) {
		if (!altClass || !element.classList.contains(theClass)) { element.classList.toggle(theClass); }
		else {
			if (element.classList.contains(altClass)) { element.classList.replace(altClass, theClass); }
			else { element.classList.replace(theClass, altClass); }
		}
	} else {  // For IE9
		var classes = element.className.split(" ");
		var i = classes.indexOf(theClass);
		if (i >= 0) {
			if (!altClass) { classes.splice(i, 1); }
			else { classes[i] = altClass; }
		}
		else {
			classes.push(theClass);
			if (altClass) {
				var j = classes.indexOf(altClass);
				if (j >= 0) { classes.splice(j, 1); }
			}
		}
		element.className = classes.join(" ");
	}
}
function addClass(element, theClass) {
	if (element.classList) {
		element.classList.add(theClass);
		return;
	}
	var classes = element.className.split(" ");
	var i = classes.indexOf(theClass);
	if (i < 0) { classes.push(theClass); }
	element.className = classes.join(" ");
}
function removeClass(element, theClass) {
	if (element.classList) {
		element.classList.remove(theClass);
		return;
	}
	var classes = element.className.split(" ");
	var i = classes.indexOf(theClass);
	if (i >= 0) { classes.splice(i, 1); }
	element.className = classes.join(" ");
}
function replaceClass(element, theClass, altClass) {
	if (element.classList) {
		element.classList.replace(theClass, altClass);
		return;
	}
	var classes = element.className.split(" ");
	var i = classes.indexOf(theClass);
	if (i >= 0) {
		classes[i] = altClass;
		element.className = classes.join(" ");
	}
}

function setupHandler(selector, theHandler, event, target, rep) {
	var els = document.querySelectorAll(selector);
	var i;
	var len = els.length;
	for (i = 0; i < len; i++) {
		els[i].addEventListener(event, function () { theHandler(this, target, rep); }, false)
	}
}


//////

function removeEl(el) { return el.parentNode.removeChild(el); }

function moveElInto(el, into, after) {
	if (el.nodeName === undefined || into.nodeName === undefined) { return; }
	after = (after === undefined || after) ? true : false;
	if (after === undefined || after) { into.appendChild(el); }
	else { into.insertBefore(el, into.firstChild); }
}
function moveAdjcentEl(el, ref, after) {
	if (el.nodeName === undefined || into.nodeName === undefined) { return; }
	after = (after === undefined || after) ? true : false;
	var into = ref.parentNode;
	if (after === undefined || after) { into.insertBefore(el, ref.nextSibling); }
	else { into.insertBefore(el, ref); }
}
function insertElInto(el, into, after) {
	var el1 = el.cloneNode(true);
	moveElInto(el1, into, after);
}
function insertAdjcentEl(el, ref, after) {
	var el1 = el.cloneNode(true);
	moveAdjcentEl(el1, ref, after);
}

/////////
function makeClosure(el, foo, dataArray) {///
	dataArray = Array.isArray(dataArray) ? dataArray : [];
	dataArray.unshift(el);
	return function () { window[foo].apply(this, dataArray); }
}
/////////
function getChildren(rent, selector, include) {
	if (rent === undefined) { rent = document; }
	if (selector === undefined) { selector = "*"; }
	rent = rent.tagName ? rent : document.body;
	var children = rent.tagName ? rent.children : document.body.children;
	if (selector === "*" && rent != document.body) { return children; }
	var decendants = rent.querySelectorAll(selector);
	var collection = [];
	for (var i = 0, ld = decendants.length; i < ld; i++) {
		if (decendants[i].parentNode === rent && ((decendants[i].tagName !== 'SCRIPT' && decendants[i].tagName !== 'STYLE' && decendants[i].tagName !== 'LINK' && decendants[i].tagName !== 'META') || include)) { collection[collection.length] = decendants[i]; }
	}
	return collection;
}

function getFirstChild(selector, inEl) {
	if (inEl === undefined) { inEl = document; }
	var children = getChildren(inEl, selector);
	return children[0];
}

function getLastChild(selector, inEl) {
	if (inEl === undefined) { inEl = document; }
	var children = getChildren(inEl, selector);
	return children[children.length - 1];
}

function isOnlyChild(selector, inEl) {
	var childCt = getChildren(selector, inEl, false).length;
	return (childCt === 1);
}

function isChildless(el) {
	var childCt = getChildren(selector, inEl, false).length;
	return (childCt === 0);
}

function hasXChildren(el, x) {
	var childCt = getChildren(selector, inEl, false).length;
	return (childCt === x);
}

//////

function getType(inEl, type, nodeNome) {
	if (nodeNome === undefined || typeof nodeNome !== 'string') { nodeNome = ''; }
	nodeNome = nodeNome.toUpperCase();
	if ((type < 1 || type > 12) && Node[type] === undefined) { return []; }
	var children = inEl.childNodes;
	var nodes = [];
	for (var i = 0, len = children.length; i < len; i++) {
		if (children[i].nodeType == type && (!nodeNome || children[i].nodeName === nodeNome)) { nodes.push(children[i]); }
	}
	return nodes;
}

function getCommNodes(inEl, indx, parse, mime) {
	var comments = getType(inEl, Node.COMMENT_NODE, false);
	return comments;
}

function childrenFromText(text, selector, first) {
	var doc = DOMparse(text, "text/html").body;
	els = getChildren(doc, selector, false);
	return els[first] !== undefined ? els[first] : els;
}

function elFromText(text, selector, first) {
	var els = DOMparse(text, "text/html").body.querySelectorAll(selector);
	return els[first] !== undefined ? els[first] : els;
}

function textToDOM(text, into, after, reference) {
	if (typeof text !== "string") {
		if (text.nodeType === Node.COMMENT_NODE) { text = text.nodeValue; }
		else { return false; }
	}
	var body = DOMparse(text, "text/html").body.childNodes;
	var currentNode = body[0];
	if (reference === undefined || !reference) {
		if (after === undefined || after) { into.appendChild(currentNode); }
		else { into.insertBefore(el, into.firstChild); }
	}
	else {
		moveAdjcentEl(currentNode, into, after);
		into = into.parentNode;
	}
	var lastNode = currentNode;
	while (body.length) {
		currentNode = body[0];
		into.insertBefore(currentNode, lastNode.nextSibling);
		lastNode = currentNode;
	}
	return true;
}

/// validate?
/*
function validateForm(form,tests,args){ /////??????
	var theForm;
	if (typeof form === typeof "a") { theForm = document.forms[form];}
	else if (theForm.tagName.toLowerCase() === "form" ){ theForm = form;}
	  results ={
			flag  : false,
			errs  : '',
			el    : {},
			elErr : {}
	}
	var mode=(args.mode);
	var reset=(args.reset);
	var currentEl,i,l,message ;
	var keys = getObjKeys(tests);
	for (i=0,l=keys.length; i<l; i++){
		message='';
		currentEl = theForm.elements[keys[i]];
		results.el[keys[i]]=currentEl; // stores current element reference
		if (isNodeList(currentEl)){

		}
		message =validate(NOTREAL,tests[i], mode);
		results.el[i] = els[i];
		results.elErr[i] = message;
		if (message){
			if (!results.flag) {results.flag = true;}
			results.errs=results.errs+message+' ';
			results.elErrs=message;/////////
		}
	}
}
*/
function validate(theForm, groups, mode, args) {
	var errs = {
		errs: '',
		grpErrs: '',
		valid: true,
		groups: {},
		sep: ' ',
		gsep: ' '

	}
	if (!isObj(args)) { args = {}; }
	if (args.sep !== undefined) { }
	if (args.gsep !== undefined) { errs.gsep = args.gsep; }
	var sep, gsep = '';
	if ((theForm.tagName && theForm.tagName.toLowerCase() === 'form') || typeof theForm === 'string') {
		if (typeof theForm === 'string') {
			theForm = (theForm.substring(0, 1) === "#") ? document.getElementById(theForm.substring(1)) : document.forms[theForm];
		}
		var currenTest, theG;
		for (var moniker in groups) {

			if (!groups.hasOwnProperty(moniker)) { continue; }
			theG = (moniker.substring(0, 1) === "#") ? document.getElementById(moniker.substring(1)) : theForm.elements[moniker];
			if (theG && theG.length === undefined) { theG = [theG]; }
			currenTest = valGroup(theG, groups[moniker].tests, mode, groups[moniker].args);//
			if (currenTest.valid !== undefined && !currenTest.valid) {
				errs.valid = false;
				sep = (currenTest.grpErrs && currenTest.elErrs) ? errs.sep : '';
				errs.errs += gsep + currenTest.grpErrs + sep + currenTest.elErrs;//
				errs.grpErrs[moniker] = currenTest.grpErrs + sep + currenTest.elErrs;//
				gsep = errs.gsep;

			}
			errs.groups[moniker] = currenTest;
		}
	}
	return errs;
}



function valValue(value, tests, singlErr) {
	var errs = { valid: true, errs: '' }
	var args;
	if (value.tagName === undefined && (tests.test || Array.isArray(tests))) {
		if (tests.test) { tests = [tests]; }
		for (var i = 0, l = tests.length; i < l; i++) {
			if (isFunction(tests[i].test)) {
				args = tests[i].args ? [value].concat(tests[i].args) : [value];
				if (!tests[i].test.apply(false, args)) {
					errs.valid = false;
					if (tests[i].err) { errs.errs += tests[i].err + ' '; }
					if (singlErr) { break; }
				}
			}
		}
	}
	return errs;
}

function valEl(element, tests, mode, groupSize) {
	if (groupSize === undefined) { groupSize = 1; }
	if (!Array.isArray(tests)) { tests = []; }
	var errs = { valid: true, errs: '', el: element }
	var args, td, tl, tp;
	if (!isObj(mode)) { mode = {} }
	if (element.tagName && element.value !== undefined) {
		var tag = element.tagName.toLowerCase();
		var ck = null;
		if (tag === 'input' && (element.type === 'checkbox' || element.type === 'radio')) {
			ck = element.checked;
		}
		else if (tag === 'option') { ck = element.selected; }
		for (var i = 0, l = tests.length; i < l; i++) {
			if (isFunction(tests[i].test)) {
				args = [];/////
				if (tests[i].data && typeof tests[i].data === 'string') {
					for (td = 0, tl = tests[i].data.length; td < tl; td++) {
						tp = tests[i].data.substring(td, 1);
						if (tp === 's') { args.push(groupSize); }
						if (tp === 'v') { args.push(element.value); }
						if (tp === 'e') { args.push(element); }
						if (tp === 'c' && ck !== null) { args.push(ck); }
					}
				}///
				if (args.length === 0) { args[0] = element.value; }

				if (tests[i].args && Array.isArray(tests[i].args)) { args = args.concat(tests[i].args); }
				if (!tests[i].test.apply(element, args)) {
					errs.valid = false;
					if (tests[i].err) { errs.errs += tests[i].err + ' '; }
					if (mode.single) { break; }
				}
			}
		}
	}
	if (mode.reset && !errs.valid) { resetFormEl(el, modes.rstdef); }
	return errs;
}

function valGroup(group, tests, mode, groupArgs) {
	var theGroup = {
		els: [],
		grpErrs: '',
		elErrs: '',
		valid: true,
		sep: ' ',
		size: 0,
		el: false
	};
	if (!isObj(groupArgs)) { groupArgs = {}; }
	var daSep = '';
	var i, gl, selectedItems, selLen, unSelLen, groupData, td, tl, tp, data;
	if (groupArgs.sep !== undefined || groupArgs.sep === false) { theGroup.sep = groupArgs.sep; }
	if (groupArgs.chk !== undefined) { theGroup = groupArgs.sep; }
	selectedItems = getSelOrChk(group);
	selLen = selectedItems.length;
	unSelLen = group.length - selLen;

	var originalGroup = group;
	if (groupArgs.sel) { group = selectedItems }
	var l = group.length;
	theGroup.size = l;
	if (groupArgs.tests && Array.isArray(groupArgs.tests)) {
		for (i = 0, gl = groupArgs.tests.length; i < gl; i++) {
			if (isFunction(groupArgs.tests[i].test)) {///////////////// runs funtion
				args = [];
				if (groupArgs.tests[i].data && typeof groupArgs.tests[i].data === 'string') {
					for (td = 0, tl = groupArgs.tests[i].data.length; td < tl; td++) {
						tp = groupArgs.tests[i].data.substring(td, 1);
						if (tp === 'c') { args.push(selectedItems); }
						if (tp === 'o') { args.push(originalGroup); }
						if (tp === 'a') { args.push(selLen + unSelLen); }
						if (tp === 'l') { args.push(l); }
						if (tp === 'u') { args.push(unSelLen); }
						if (tp === 's') { args.push(selLen); }
					}
				}
				if (args.length === 0) { args = [l]; }
				if (groupArgs.tests[i].args && Array.isArray(groupArgs.tests[i].args)) { args = args.concat(groupArgs.tests[i].args); }
				if (!groupArgs.tests[i].test.apply(group, args)) {
					theGroup.valid = false;
					if (groupArgs.tests[i].err) { theGroup.grpErrs += daSep + groupArgs.tests[i].err; }
					daSep = theGroup.sep;
					if (groupArgs.single) { break; }
				}
			}
		}
	}
	if (theGroup.valid || (!theGroup.valid && !groupArgs.single) || (!theGroup.valid && groupArgs.single === '+')) {//////sinlge obj + mode
		for (i = 0; i < l; i++) {
			theGroup.els[i] = valEl(group[i], tests, mode, l);
			if (l === 1) { theGroup.el = theGroup.els[0]; }
			if (!theGroup.els[i].valid) {
				theGroup.valid = false;
				theGroup.elErrs += daSep + theGroup.els[i].errs;
				daSep = theGroup.sep;
			}
		}
	}
	return theGroup;
}


function resetFormEl(el, def) {
	if (def === undefined) { def = ''; }
	if (el.tagName) switch (el.tagName.toLowerCase()) {
		case 'input':
			if (el.type === "radio" || el.type === "checkbox") { def = def ? true : false; }
			switch (el.type) {
				case "radio":
				case "checkbox": e.checked = def; break;
				case "button":
				case "submit":
				case "hidden":
				case "image": break;
				default: el.value = def; break;
			}
			break;
		case 'select': el.selectedIndex = 0; break;
		case 'textarea': el.innerHTML = ''; break;
	}
}


function isFunction(functionToCheck) {
	//return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	return !!(functionToCheck && functionToCheck.constructor && functionToCheck.call && functionToCheck.apply);
}

function isChecked(obj) { return obj.checked; }

function isNotChecked(obj) { return !obj.checked; }

//////???????
function checkReq(val) { return !(val === undefined || val === null || val.trim === ''); }

/////CREDICT CARD VALIDATION
function validateCCN(CCN, type) {
	var types = {
		AmEx: /^3[47][0-9]{13}$/,
		Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
		VMst: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
		Disc: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
		Mast: /^5[1-5][0-9]{14}$/,
		Dine: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
		JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
		all: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
	}
	var RGX = (types[type] !== undefined) ? types[type] : types['all'];
	return (RGX.exec(CCN + '') !== null);
}
function USPhone(phone) { 																					// validates  for US phone #
	phone = stripChar(/[-() .]/g, phone);
	if (!checkLength(phone, 10, 11)) { return false; }
	if (!RGXval(phone, 'allNo')) { ; return false; }
	if (phone.length == 11 && phone[0] != '1') { return false; }
	if (phone.length == 11 && phone[0] == '1') { phone = phone.substr(1, phone.length - 1); }
	if (phone.substr(3, 3) == '555') { return null; }
	return true;
}
function USZIP(zip) { 																						// validates  for US ZIP #
	if (!checkLength(zip, 5, 5)) { return false; }
	if (!RGXval(zip, 'allNo')) { return false; }
	return true;
}
function trueWord(word) { return RGXval(word, 'word'); }   														//   validate a word or name  (alias foo call)
function longerThan(a, b) { return (a.length > b.length); }   														//
function shorterThan(a, b) { return (a.length < b.length); }   														//
function equalLenth(a, b) { return (a.length === b.length); }   														//
function compareValues(a, b, eq) {
	if (eq === '<') { return (a < b); }
	else if (eq === '>') { return (a > b); }
	else if (eq === '<=') { return (a <= b); }
	else if (eq === '>=') { return (a >= b); }
	else if (eq === '===') { return (a === b); }
	else { return (a == b); }
}   														//

function fallsBetween(val, a, b) { return (a > val && val < b); }   														//

function notBlank(str) {  																					// checks for  empty  string/field
	if (str.trim() == '') { return false; }
	return true;
}
function lengthBetween(obj, mn, mx) { 																			// checks the sise of an object (or array, or string) to be between two given values
	if (obj.length > mx || obj.length < mn) { return false; }
	return true;
}
function maxLength(obj, mx) { 																			// checks the sise of an object (or array, or string) to be less than some value
	if (obj.length > mx) { return false; }
	return true;
}
function minLength(obj, mn) { 																			// checks the sise of an object (or array, or string) to be more than some values
	if (obj.length < mn) { return false; }
	return true;
}
function exactLength(obj, len) { 																			// checks the sise of an object (or array, or string) to be more than some values
	if (obj.length !== len) { return false; }
	return true;
}
function RGXval(name, type) {    																				// perform prescripted REGEX checks
	rgxS = {
		'email': /^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/,
		'word': /^[a-zA-Z ']+$/,
		'allNo': /^[0-9]+$/
	}
	if (typeof rgxS[type] == 'undefined') { return null; }
	//var reg = new RegExp(rgxS[type]);
	return rgxS[type].test(name);
}

/// string cycle
function RM_cycle(cycle, loop, delim) {
	if (!loop) { loop = false; }
	if (!delim) { delim = ','; }
	// convert string to into array
	if (typeof cycle === 'string') { cycle = cycle.split(delim); }
	this.cycle = cycle;
	this.loop = loop;
	this.curr = null;
	this.next = function (peek) {
		var indx = this.curr === null ? 0 : this.curr + 1;
		if (indx >= this.cycle.length) {
			if (this.loop) { indx = this.loop === 'stick' ? this.cycle.length - 1 : 0; }
			else return undefined;
		}
		if (!peek) { this.curr = indx; }
		return this.cycle[indx];
	}
	this.prev = function (peek) {
		var indx = this.curr === null ? this.cycle.length - 1 : this.curr - 1;
		if (indx < 0) {
			if (this.loop) { indx = this.loop === 'stick' ? 0 : this.cycle.length - 1; }
			else return undefined;
		}
		if (!peek) { this.curr = indx; }
		return this.cycle[indx];
	}
	this.rand = function () { return this.cycle[Math.floor(Math.random() * (cycle.length + 1))]; }
	this.get = function (indx) {
		if (indx === undefined) { indx = this.curr === null ? 0 : this.curr; }
		return this.cycle[indx];
	}
}

///+++
function stripChar(clearChar, dirtyString) { return dirtyString.replace(clearChar, ''); }  						// deletes selected characters from string

function errMess(el, messA, messB) {   																		// creates an error message based the preceding  tag in the markup, presumably  a label
	///// ?????EDIT THIS FOO!
	targ = el.previousElementSibling.innerHTML.replace(/<[^>]*>/g, "");
	targ = el.previousElementSibling.innerHTML.replace(/:$/g, "");
	return (messA + targ + messB);
}

function zippoFill(obj, errMess, forVal, forHTML, gr, addi) {///auto fills from ZIP info
	doAJAX("http://zip.getziptastic.com/v2/US/" + obj.value, null, fillFromAJAX, "GET", [obj, errMess, forVal, forHTML, gr, addi], "text/json", clearValAJAX);
}
function fillFromAJAX(textObj, obj, errMess, forVal, forHTML, unHide, shiftFocus) {
	var info = JSON.parse(textObj);
	var looper = [forVal, forHTML];
	var actOn, el;
	var props = ["value", "innerHTML"];
	for (var i = 0, l = looper.length; i < l; i++) {
		for (actOn in looper[i]) {
			if (looper[i][actOn].tagName) { looper[i][actOn] = [looper[i][actOn]]; }
			for (var j = 0, lj = looper[i][actOn].length; j < lj; j++) {
				el = looper[i][actOn][j];
				el[props[i]] = info[actOn];
			}
		}
		if (props === "value") {
			if (unHide.tagName !== undefined) { unHide.className = unHide.className.replace('hide', ''); }
			if (shiftFocus.tagName !== undefined) { shiftFocus.focus(); }
		}
	}
}

function confirmObj(errMess, obj, prop, val, clearVal) {
	var Err = (isObj(obj));
	if (typeof prop === 'string' || typeof prop === 'number') {
		Err = (Err && obj[prop] !== undefined);
		if (val !== undefined && Err) {
			Err = (obj[prop] === val);
			if (clearVal && !Err) { obj[prop] = null; }
		}
	}
	if (errMess && !Err) { alert(errMess); }
	return Err;
}

function trim(str, side, lTrim, rTrim) {
	if (typeof str !== 'string') return str;
	if (!lTrim) { lTrim = /^\s*/; }
	if (!lTrim) { rTrim = /\s*$/; }
	if (!side || side === 'l' || side === 'L') { str = str.replace(lTrim, ''); }
	if (!side || side === 'r' || side === 'R') { str = str.replace(rTrim, ''); }
	return str;
}

function preventDefault(event) { (event.preventDefault) ? event.preventDefault() : event.returnValue = false; }

function nonZeroFalse(value, nonBlank, lim) {
	if (!lim) { lim = 0; }
	if (!value) {
		if (value === 0 || value === '0' || (nonBlank && typeof value === 'string' && value.length >= lim)) { return true; }
	}
	return true;
}


function hasChecked(el, chkGrp) {
	if (chkGrp === undefined) { chkGrp = false; }
	if (chkGrp && el.length && el[0] !== undefined) { el = el[0]; }
	if (el.tagName && el.tagName.toLowerCase() === 'input' && (el.type.toLowerCase() === 'checkbox' || el.type.toLowerCase() === 'radio')) { return true; }
	return false;
}


////*provisionary foos*////
function getFormElemets(form, veri) {
	var formEls = [];
	if (form.tagName.toLowerCase() === 'form') {
		formEls = form.elements;
	}
}

function getSets(form, name, checked) {
	if (form.querySelectorAll === undefined) { return []; }
	checked = (checked) ? ':checked' : '';
	var set = form.querySelectorAll('*[name="' + name + '"]' + checked)
}
/////////

function require(obj, min, ct) {
	if (isNodeList(obj)) { obj = obj.item(0); }
	var typ = obj.type;
	var inForm = obj.form;
	var i, l, group, selCt;
	var evlObj = true;
	// radio
	if (typ === 'radio' || typ === 'checkbox') {
		var nme = obj.name;
		group = inForm[nme];
	}
	if (typ === 'radio') {
		for (i = 0, l = group.length; i < l; i++) {
			if (group[i].checked) { return true; }
		}
		return false;
	}
	// check
	else if (typ === 'checkbox') {
		if (min !== undefined) { min = null; }
		if (ct !== undefined) { ct = 1; }
		var total = 0;
		for (i = 0, l = group.length; i < l; i++) {
			if (group[i].checked) { total++ }
			if (min === true && total === ct) { return false }
		}
		if ((min === false && total <= ct) || ((min === null && total === ct))) { return true; }
		return false;
	}
	// select
	else if (typ === 'select') {
		if (!obj.multiple) { return (obj.selectedIndex > 0); }
		group = inForm[nme];
		total = 0;
		for (var i = 0; i < obj.options.length; i++) {
			if (obj.options[i].selected) { total++ };
			if (min === true && total === ct) { return false }
		}
		if ((min === false && total <= ct) || ((min === null && total === ct))) { return true; }
		return false;
	}
	return (obj.value !== null && obj.value.trim !== '' || (min !== undefined && obj.value !== min));
}


////////////////////recursive
function recursiveSetListener(root, evnt, levels) {
	/*
		[{
			targ :#seconSel,
			evnt: event,
			ebf:[{foo:functions(),args:[]}],
			foos:[{foo:functions(),args:[]],
			eaf:[{foo:functions(),args:[]}]
		},
		{...},{...},{...},{...}]
	*/

	if (!Array.isArray(levels)) { return; }  // insure levels is an array
	var thisLevel = levels.shift();
	addListener(root, evnt, makeClosure(root, function (levels, thisLevel, root) { recListenEng(levels, thisLevel, root); }, [levels.slice(0), thisLevel]));
	var newEvent = (thisLevel.e) ? thisLevel.e : evnt;
	if (levels.length > 0) { recursiveSetListener(thisLevel.targ, newEvent, levels); }

}

function recListenEng(levels, thisLevel, root) {
	var fooType = ['ebf', 'foos', 'eaf'];
	var levelLoops = levels.length;
	var i, l, j, levelFoos, theArgs;
	var prevTarg = thisLevel.targ;
	//runs functions
	for (var fooI = 0, typeCt = fooType.length; fooI < typeCt; fooI++) {
		if (Array.isArray(thisLevel[fooType[fooI]]) && thisLevel[fooType[fooI]].length > 0) {
			if (fooType[fooI] !== 'eaf') {
				levelFoos = argArray(thisLevel[fooType[fooI]]);
				for (i = 0, l = levelFoos.length; i < l; i++) {
					theArgs = argArray(levelFoos[i].args);
					theArgs.push(root, thisLevel.targ, root);
					levelFoos[i].foo.apply(this, theArgs);
				}
			}
			if (fooType[fooI] === 'foos') {  //////?
				for (j = 0; j < levelLoops; j++) {
					levelFoos = argArray(levels[j][fooType[fooI]]);
					for (i = 0, l = levelFoos.length; i < l; i++) {
						theArgs = argArray(levelFoos[i].args);
						theArgs.push(prevTarg, levels[j].targ, root);
						levelFoos[i].foo.apply(this, theArgs);
					}
				}
			}
			if (fooType[fooI] === 'eaf') {
				levelFoos = argArray(thisLevel[fooType[fooI]]);
				for (i = 0, l = levelFoos.length; i < l; i++) {
					theArgs = argArray(levelFoos[i].args);
					theArgs.push(root, thisLevel.targ, root);
					levelFoos[i].foo.apply(this, theArgs);
				}
			}
		}
	}
}


//////////////
function lockElEm(el, e, opts) {
	opts = defaultBlankObj(opts);
	if (!el.oldOnClick && !opts.store) { el.onclick = el.onclick; };
	if (!opts.dim) { el.style.opacity = '0.4'; };
	el.onclick = function (e) { e.preventDefault(); return false; }
}
function unlockElEm(el) {
	if (el.oldOnClick) { el.onclick = el.oldOnClick; el.oldOnClick = null; }
	else { el.onclick = null }
	el.style.opacity = '1';
}


function simultCheck(el, same, opposite, mode) {
	mode = defaultBlankObj(mode);
	same = argArray(same);
	opposite = argArray(opposite);
	var targets = [same, opposite];
	var j, len, status;
	if (typeof mode.lock === 'string') { mode.lock = mode.lock.toLowerCase(); }
	for (var i = 0; i < 2; i++) {
		status = (i === 1) ? !el.checked : el.checked;  // opposite or same as source
		for (var j = 0, len = targets[i].length; j < len; j++) {
			targets[i][j].checked = (mode.tog) ? !targets[i][j].checked : status; // use status or toggel existing
			if ((mode.lock === 'opp' && !status) || (mode.lock === 'same' && status) || (mode.lock === 'chk' && el.checked) || (mode.lock === 'unchk' && !el.checked) || (mode.lock === 'tchk' && targets[i][j].checked) || (mode.lock === 'tunchk' && !targets[i][j].checked)) { lockElEm(targets[i][j], event) } //set read only
			if ((mode.lock === 'same' && status) || (mode.lock === 'opp' && !status) || (mode.lock === 'chk' && !el.checked) || (mode.lock === 'unchk' && el.checked) || (mode.lock === 'tunchk' && targets[i][j].checked) || (mode.lock === 'tchk' && !targets[i][j].checked)) { unlockElEm(targets[i][j], event) } //set read only
		}
	}
	if (mode.lock === 'cchk' || mode.lock === 'cunchk' && Array.isArray(mode.tarr)) {
		for (var i = 0, len = mode.tarr.length; i < len; i++) {
			if ((mode.lock === 'cchk' && el.checked) || (mode.lock === 'cunchk' && !el.checked) || (mode.lock === 'ctunchk' && !mode.tarr[i].checked) || (mode.lock === 'ctchk' && mode.tarr[i].checked)) { lockElEm(mode.tarr[i], event) }
			if ((mode.lock === 'cchk' && !el.checked) || (mode.lock === 'cunchk' && el.checked) || (mode.lock === 'ctunchk' && mode.tarr[i].checked) || (mode.lock === 'ctchk' && !mode.tarr[i].checked)) { unlockElEm(mode.tarr[i], event) }
		}
	}
}

function checkEnable(target, el, reverse) {
	var effect = (!reverse === el.checked) ? false : true;
	target.disabled = effect;
}

function executeFunctionByName(functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

function getSelOpts(el) {
	if (el.tagName && el.tagName.toLowerCase() === 'select') {
		var options = el.options;
		var seled = Array();
		for (var i = 0, l = options.length; i < l; i++) {
			if (options[i].selected) { seled.push(options[i]); }
		}
		return seled;
	}
	return [];
}

function getInputType(el) {
	var theType = false;
	if (el.size !== undefined && el[0] !== undefined && el[0].tagName.toLowerCase() === "input") { theType = el[0].type.toLowerCase(); }
	if (el.tagName && el.tagName.toLowerCase() === "input") { theType = el.type.toLowerCase(); }
	return theType;
}

function isArray(arr) {
	//return Object.prototype.toString.call(arr) === '[object Array]';
	return (arr !== undefined && arr !== null && arr.constructor === Array);
}
function isObj(obj) {
	//return ( obj !== null && {}.toString.call( obj ) === '[object Object]');
	return (obj !== undefined && obj !== null && obj.constructor === Object);
}
function isBool(bool) {
	return (bool !== undefined && bool !== null && bool.constructor === Boolean);
}
function isString(str) {
	return (str !== undefined && str !== null && str.constructor === String);
}
function isNumber(num) {
	return (num !== undefined && num !== null && num.constructor === Number);
}
function isFoo(foo) {
	return (foo !== undefined && foo !== null && str.constructor === Function);
}

function isType(obj, typ) {
	if (typ === undefined || str === null || str.constructor !== String) { return false; }
	let constructors = { o: Object, n: Number, s: String, f: Function, a: Array, b: Boolean };
	if (constructors[typ] === undefined) { return false; }
	return (obj !== undefined && obj !== null && obj.constructor === constructors[typ]);
}
function isMatchedType(obj1, obj2) {
	if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
		return (obj1 === obj2)
	}
	return obj1.constructor === obj2.constructor;
}

function getSelOrChk(list, not) {///obtained from nodelist mnggr
	not = (not === undefined || not) ? true : false;
	var selList = Array();
	var mult = true;
	var tag = list.tagName ? list.tagName.toLowerCase() : false; // have I been sent an element?
	if (tag && (tag !== 'option' && tag !== 'select' && (tag === 'input' && tag.checked === undefined))) { return selList; }
	if (tag === 'select') { // if it's sent a  <select> get the options
		mult = list.multiple;            // possibly set mut to false, all other cases mut is true
		tag === 'option';
		list = list.options;
	}
	if (tag === 'input' || tag === 'option') { list = Array(list); } // singular option or input sent. Also prevent other tags from beign  procesed
	if (list.length) {  // prevents empty lists from entering a loop
		if (tag && (tag !== 'option' && (tag === 'input' && tag.checked === undefined))) { return selList; }
		var prop = (list[0].selected !== undefined || list[0].checked !== undefined);
		if (prop) {
			prop = list[0].checked !== undefined ? 'checked' : 'selected';
			var type = prop === "checked" ? list[0].type : false;
			for (var i = 0, l = list.length; i < l; i++) {
				if (list[i][prop] == not) {
					selList.push(list[i]);
					if (type === 'radio' || !mult) { break; }
				}
			}
		}
	}

	return selList;
}




function makeCookie(name, value, days, unit) {
	days = days ? days : 1;
	switch (unit) {
		case 'd':
			unit = 864000;
			break;
		case 'm':
			unit = 6000;
			break;
		case 'h':
			unit = 36000;
			break;
		default:
			unit = 1000;
	}
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * unit));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function killCookie(name) {
	makeCookie(name, "", -1);
}

/// TRIM and HTML replace
function RM_trim(str) {
	if (typeof str == typeof 'string') {
		str = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	}
	return str;
}

function innerHTMLreplace(el, rep, swap) {
	var repStr = rep;
	if (rep instanceof HTMLElement) {
		repStr = rep.innerHTML;
		if (swap) { rep.innerHTML = (swap === 'move') ? '' : el.innerHTML; }
	}
	el.innerHTML = repStr;
}


function copyToClip(str) {
	var el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};

function copyInputToClip(el) {
	el.select();
	document.execCommand('copy');
};

function rm_cloneData(item, deep) {
	if (deep) { return JSON.parse(stringify(item)); }
	if (isArray(item)) { return item.slice(); }
	var copy;
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) { copy[attr] = clone(obj[attr]); }
	}
	return copy;
}

function imgToBg2(img, el) {
	el.style.backgroundImage = 'url(' + img.src + ')';
	img.parentNode.removeChild(img);
}

function dataFill(theString, userData, args) {
	if (!isObjLit(args)) { args = {}; }
	var offst = typeof args.off === 'number' ? args.off : 0;
	var et = (args.et && typeof args.et === 'string') ? args.et : '}';
	var st = (args.st && typeof args.st === 'string') ? args.st : '{';
	var commonData = (args.data && isObjLit(args.data)) ? args.data : {};
	var regex = new RegExp(st + '([a-zA-Z0-9_]+)' + et, 'g');
	var holds = [];
	var theData = userData;
	var ct = new RegExp(st + '#' + et, 'g');
	var at = new RegExp(st + '@' + et, 'g');
	var theResults = new Array();
	var arrFlag = false;
	var hasElList = (isArrLit(args.els) && args.els.length > 0 && args.els[0].innerHTML !== undefined);
	var hasCallback = isFooLit(args.callb);
	var dataToSend, hasSentTxt, dataFillKey;

	//accept an array of object litterals as data arguments
	if (!isArrLit(userData)) {
		arrFlag = true;
		if (isObjLit(userData)) { theData = [userData]; }
		else { theData = [{}]; }
	} else if (!isObjLit(userData[0])) { theData = [{}]; }

	// efficently gather  active placeholders
	let temp = {};
	let i = 0;
	while ((raw = regex.exec(theString))) {
		if (temp[raw[1]] !== undefined) { continue; }
		holds[i] = raw;
		temp[raw[1]] = true;
		i++;
	}

	for (let i = 0, l = theData.length; i < l; i++) {// data loop
		datum = theData[i];
		tempString = theString.replace(at, i + offst).replace(ct, l);///

		for (let j = 0, ll = holds.length; j < ll; j++) {
			regex = new RegExp(holds[j][0], 'g');
			if (theData[i][holds[j][1]] !== undefined) { tempString = tempString.replace(regex, theData[i][holds[j][1]]); }
			else if (commonData[holds[j][1]] !== undefined) { tempString = tempString.replace(regex, commonData[holds[j][1]]); }
			else {
				if (args.rep === null) { tempString = tempString.replace(regex, holds[j][1]); } // removes brackets
				if (args.rep === false) { tempString = tempString.replace(regex, ''); } // removes placehold
				if (typeof args.rep == "string") { tempString = tempString.replace(regex, args.rep); }//replaces placehold with standard
			}
		}
		theResults[i] = tempString;
		////append html
		if (hasElList && args.els[i].innerHTML !== undefined) { args.els[i].innerHTML = tempString; }
		//run foo
		if (hasCallback) {
			dataToSend = [];
			hasSentTxt = false;
			if (isArrLit(args.order)) {
				for (let k = 0, lk = args.order.length; k < lk; k++) {
					if (isArrLit(args.order[k])) { Array.prototype.push.apply(dataToSend, args.order[k]); continue; }// add the custum array of args
					if (args.order[k] === 't') { dataToSend[k] = tempString; hasSentTxt = true; continue; } // *add the modifed text
					if (args.order[k] === '#') { dataToSend[k] = l; continue; } // add the total count
					if (args.order[k] === '@') { dataToSend[k] = i + offst; continue; }// * add the current count
					if (hasElList && args.order[k] === 'e') { dataToSend[k] = tempString; hasSentTxt = true; continue; }//  *add the current element from the eleent list
					if (hasElList && args.order[k] === 'l') { dataToSend[k] = args.els; }//  add the   the element list*
					if (args.target && args.order[k] === '^') { dataToSend[k] = args.target; }//  add the  tareget el reference
				}
			}
			if (!hasSentTxt) { dataToSend.push(tempString) }
			args.callb.apply(this, dataToSend);
		}
	}// data loop
	return arrFlag ? theResults[0] : theResults;
}

function isObjLit(obj) { return (Object.prototype.toString.call(obj) === "[object Object]"); }

function isArrLit(obj) { return (Object.prototype.toString.call(obj) === "[object Array]"); }

function isFooLit(obj) { return (Object.prototype.toString.call(obj) === "[object Function]"); }

function isDOMel(obj) { return (obj && obj.tagName !== undefined); }

function rm_AppendTemplate(targ, text) {
	var templt = document.createElement('template');
	targ.appendChild(templt.content.cloneNode(true));
}

function rm_genClickClose(parent, args) {
	args = isObjLit(args) ? args : {};
	var make = false;   // flag indicating the  clickable element needs to be created
	var el, clickFoo;

	if (!isDOMel(args.el)) { make = args.apnd ? 1 : 2; }
	else { el = args.el; }

	if (!isDOMel(parent)) {
		if (make) { return };  //  if no element and no parent abort script;
		parent = el.parentNode; // else,  default parent is the pparentNode of the el element passed
	}

	if (make && parent) { //inserts the element
		//creates el
		var tag = 'span';
		if (typeof args.tag === 'string') {
			var allowabeTags = ['span', 'p', 'div', 'b', 'strong', 'em', 'i'];
			args.tag.toLowerCase();
			if (allowabeTags.indexOf(args.tag) > -1) { tag = args.tag; }
		}
		el = document.createElement(tag);
		//adds text node
		var txtString = typeof args.txt === 'string' ? args.txt : 'x';
		txtString = document.createTextNode(txtString);
		if (typeof args.clss === 'string') { el.className = args.clss; }// adds class to close button
		el.appendChild(txtString);
		if (make % 2) { parent.appendChild(el); }//inserts before first child
		else { parent.insertBefore(el, parent.firstChild); }//inserts after last child
	}

	//chose function
	if (isFooLit(args.foo)) { clickFoo = args.foo; }
	else if (typeof args.foo === 'string') { clickFoo = function () { return parent.classList.toggle(args.foo); } }
	else { clickFoo = function () { return parent.parentNode.removeChild(parent); } }
	//  ads function
	el.onclick = clickFoo;
}

function rm_clickClose(el, mode, parent) {
	if (!isDOMel(parent)) { parent = el.parentNode; console.log(el); }
	if (typeof mode === 'string') { return parent.parentNode.classList.toggle(mode); }
	return parent.parentNode.removeChild(parent);
}

function rm_argClosure(theFoo, ...argsArr) { return function () { theFoo.apply(this, argsArr); } }

function rm_delegate(eventName, selector, callback, args, root) {
	if (!root || !root.tagname) { root = (typeof root == 'string') ? document.querySelector(root) : document.body; }
	if (!args) { args = []; }
	root.addEventListener(eventName, function (e) { if (e.target && e.target.matches(selector)) { callback.apply(e.target, args); } });
}

function rm_getElIndex(el, root, selector) {
	var nodes;
	if (typeof selector === 'string') {
		nodes = (root && root.tagname) ? root.querySelectorAll(selector) : document.querySelectorAll(selector);
	}
	else { nodes = (root && root.tagname) ? root.children : el.parentNode.children; }
	nodes = Array.prototype.slice.call(nodes);
	return nodes.indexOf(el);
}

function rm_is_equivalent(a, b, strict) {
	if (strict && typeof a != typeof b) { return false; }
	if (typeof a == 'boolean' || typeof b == 'boolean') {
		a = !a || ((a === 'false' || a == '0')) ? false : true;
		b = !b || ((b === 'false' || b == '0')) ? false : true;
	}
	a = typeof a == 'object' ? JSON.stringify(a) : a;
	b = typeof b == 'object' ? JSON.stringify(b) : b;
	return a == b;
}

function rm_xor(a, b) { return ((!$a && $b) || ($a && !$b)); }

function isIdentical(val1, val2, nullish = false) {
	if (isScalar(val1, nullish) && isScalar(val2, nullish)) { return (val1 == val2); }
	if (Array.isArray(val1) && Array.isArray(val2) && val1.every((v, i) => val2[i] == v)) { return true; }
	if (Object.getPrototypeOf(val1) === Object.prototype && Object.getPrototypeOf(val1) === Object.prototype) {
		let k = Object.keys(val1);
		return k.every(k1 => val2[k1] === val1[k1]);
	}
	return (JSON.stringify(val1) === JSON.stringify(val2));
	//let possible = JSON.stringify(val1) === JSON.stringify(val2);
	//Object.getPrototypeOf(obj) === Object.prototype
	//return possible;
}

function isScalar(val, nullish) {
	let reg = nullish ? /boolean|number|string|null|undefined|NaN/ : /boolean|number|string|NaN/
	return reg.test(typeof val);
}

function isNullish(val) {
	return (/null|undefined/).test(typeof val);
}

function isEmpty(val, strict) {
	switch (typeof val) {
		case 'boolean':
			if (strict) { return false; }
			return val;
		case 'string':
			if (strict) { return (val === ""); }
			return (!str || /^\s*$/.test(str));
		case 'object':
			if (val === null) { return true; }
			return (Object.keys(val).length == 0);
		case 'number':
			if (val === NaN) { return true; }
			return val ? false : true;
		default:
			return val ? false : true;
	}
}

function nonBinaryToggle(currentState, states) {
	// insures values are unique
	states = states instanceof Set ? states : new Set(states);
	states = Array.from(states);
	return states[(states.indexOf(currentState) + 1) % states.length];
}

function* cycleThrough(arr, loop = false, start = 0) {
	for (let i = start, l = arr.length; i < l; i++) {
		let res = arr[i];
		yield res;
		if (loop && i >= l - 1) { i = -1; }
	}
	return
}

function prepEvent(self, gen, handler, evName = false) {
	if (!evName) { return () => { handler(gen.next(), self) } }
	else {
		self['on' + evName] = () => { handler(gen.next(), self); }
		self['on' + evName]();
	}
}