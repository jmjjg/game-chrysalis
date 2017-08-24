/*jslint for*/

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 *
 * @see {@link https://stackoverflow.com/a/6274381}
 */
var shuffle = function(a) {
	"use strict";

	var j, x, i;
	for (i = a.length; i; i-=1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
};

/**
 * Vérifie que la variable soit un Objet et pas un Array.
 *
 * @param {*} variable
 * @returns {Boolean}
 */
var isObject = function(variable) {
	"use strict";

	return 'object' === typeof variable && false === Array.isArray(variable);
};