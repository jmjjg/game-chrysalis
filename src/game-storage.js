/*global $*/
/*jslint this*/
var GameStorage = function(name, defaults) {
	"use strict";

	this.name = name;
	this.defaults = 'undefined' === typeof defaults ? {} : defaults;
	this.data = localStorage.getItem(this.name);
	this.data = null === this.data ? {} : JSON.parse(this.data);

	this.data = Object.assign({}, this.defaults, this.data);
};

GameStorage.prototype.clear = function() {
	"use strict";

	localStorage.removeItem(this.name);
	this.data = {};
};

GameStorage.prototype.persist = function() {
	"use strict";

	localStorage.setItem(this.name, JSON.stringify(this.data));
};

GameStorage.prototype.read = function(key, defaults) {
	"use strict";

	var value;
	defaults = 'undefined' === typeof defaults ? null : defaults;

	if('undefined' === typeof key) {
		value = this.data;
	} else {
		value = this.data[key];
		if('undefined' === typeof value) {
			value = defaults;
		}
	}
	return value;
};

GameStorage.prototype.write = function(key, value) {
	"use strict";

	if('object' === typeof key
		&&  false === Array.isArray(key)
		&& 'undefined' === typeof value)
	{
		this.data = Object.assign({}, this.data, this.key);
	} else {
		this.data[key] = value;
	}

	this.persist();
};

GameStorage.prototype.keys = function() {
	"use strict";

	return Object.keys(this.defaults);
};