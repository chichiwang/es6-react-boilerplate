'use strict';

/** [method] exists
  * Existential check
  */
var exists = (obj) => {
	return (typeof obj !== "undefined" && obj !== null);
}

/** [method] isEmpty
  * Checks if a variable is empty
  */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var _isEmpty = function(obj) {
	if ((obj === null) || (typeof obj === 'undefined'))
		return true;

	if (typeof obj === 'boolean') return false;

	if (obj.length > 0) return false;
	if (obj.length === 0) return true;

	if ((typeof Object.getOwnPropertyNames === 'function') && (typeof obj === "object")) {
		if (Object.getOwnPropertyNames(obj).length > 0)
			return false;
	}
	else {
		for (key in obj) {
			if (hasOwnProperty.call(obj, key)) return false;
		}
	}
	return true;
};

/** [method] type
  * A stricter, less error-prone type detection method
  * Borrowed from:
  * http://arcturo.github.io/library/coffeescript/07_the_bad_parts.html
  */
{
	let classToType = (function() {
		var objectMap = {};
		for (let name of "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")) {
			objectMap["[object " + name + "]"] = name.toLowerCase();
		}
		return objectMap;
	})();
	var _type = (obj) => {
		if (typeof obj === 'undefined') return 'undefined';
		var strType = Object.prototype.toString.call(obj);
		return classToType[strType] || "object";
	}
}

/** [method] forEach
  * forEach over an array
  */
var forEach = (arr, cb, ctx) => {
	var type = _type;
	ctx = ctx || window;
	if (type(arr) !== 'array')
		throw new Error('forEach: first argument must be of type Array!');
	if (typeof cb !== 'function')
		throw new Error('forEach: second argument must be of type Function!');

	if (Array.prototype.forEach) {
		arr.forEach(cb, ctx);
	}
	else {
		for (let i = 0; i < arr.length; i++) {
			cb.apply(ctx, [arr[i], i, arr]);
		}
	}
}

/** [method] clone
 * A mix of solutions from:
 * http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/13333781#13333781
 * http://coffeescriptcookbook.com/chapters/classes_and_objects/cloning
 */
{
	let objectCreate = Object.create;
	if (typeof objectCreate !== 'function')
		objectCreate = (o) => {
			F = function(){};
			F.prototype = o;
			return new F();
		};

	var _clone = (obj, _copied) => {
		var type = _type;
		// Null or Undefined
		if (!exists(obj) || typeof obj !== 'object')
			return obj;

		// Init _copied list (used internally)
		if (typeof _copied === 'undefined')
			var _copied = [];
		else
			if (obj in _copied) return obj;
		_copied.push(obj);

		// Native/Custom Clone Methods
		if (typeof obj.clone === 'function')
			return obj.clone(true);
		// Array Object
		if (type(obj) === 'array') {
			let result = obj.slice();
			forEach(result, function(val, idx) {
				result[idx] = _clone(val, _copied);
			});
			return result;
		}
		// Date Object
		if (obj instanceof Date)
			return new Date(obj.getTime());
		// RegExp Object
		if (obj instanceof RegExp) {
			let flags = '';
			if (exists(obj.global)) flags += 'g'
			if (exists(obj.ignoreCase)) flags += 'i';
			if (exists(obj.multiline)) flags += 'm';
			if (exists(obj.sticky)) flags += 'y';
			return new RegExp(obj.source, flags);
		}
		// DOM Element
		if (exists(obj.nodeType) && typeof obj.cloneNode === 'function')
			return obj.cloneNode(true);

		// Recurse
		let proto = (exists(Object.getPrototypeOf)) ? Object.getPrototypeOf(obj) : obj.__proto__;
		proto = proto || obj.constructor.prototype;
		let result = objectCreate(proto);
		for (let key in obj) {
			result[key] = _clone(obj[key], _copied);
		}
		return result;
	}
}
// # [method] documentReady
// # Executes a function on document ready
// # Borrowed from:
// # http://stackoverflow.com/a/9899701/1161897
// readyList = []
// readyFired = false
// readyBound = false
// _ready = ->
// 	return if readyFired
// 	readyFired = true
// 	for listItem in readyList
// 		context = if listItem.hasOwnProperty? and listItem.hasOwnProperty('ctx') then listItem.ctx else window
// 		listItem.fn.call context
// 	readyList = []
// _documentReady = (callback, context) ->
// 	# if ready has already fired, then just schedule the callback
// 	# to fire asynchronously, but right away
// 	if readyFired
// 		setTimeout ->
// 			callback.call context
// 		, 1
// 	# else add the function and context to the list
// 	else
// 		listItem = {}
// 		listItem.fn = callback
// 		listItem.ctx = context if type(context) isnt undefined
// 		readyList.push listItem
// 	# if document already ready to go, schedule the ready function to run
// 	if document.readyState is 'complete'
// 		setTimeout _ready, 1
// 	# if document isn't ready and the ready event listeners haven't been bound
// 	else if not readyBound
// 		if document.addEventListener
// 			# first choice is DOMContentLoaded event
// 			document.addEventListener "DOMContentLoaded", _ready, false
// 			# backup is window load event
// 			window.addEventListener "load", _ready, false
// 		readyBound = true


// Bundle helper methods for export
var Helpers = {
	isEmpty: (...args) => {
		return _isEmpty.apply(this, args);
	},
	type: (...args) => {
		return _type.apply(this, args);
	},
	
	clone: (...args) => {
		return _clone.apply(this, args);
	}
	// documentReady: (args...) ->
	// 	_documentReady.apply @, args
};

module.exports = Helpers;