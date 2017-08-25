/*jslint for*/

/**
 * Retourne une copie de l'array original randomisé.
 *
 * @param {Array} original L'array original
 * @returns {Array}
 * @see Original: {@link https://stackoverflow.com/a/6274381}
 */
var shuffle = function(original) {
	"use strict";

	var j, x, i, result = original.slice();
	for (i = original.length;i>0;i-=1) {
		j = Math.floor(Math.random()*i);
		x = result[i-1];
		result[i-1] = result[j];
		result[j] = x;
	}
	return result;
};

/**
 * Vérifie que la variable soit bien un Objet, ni NULL ni un Array.
 *
 * @param {*} variable
 * @returns {Boolean}
 */
var isObject = function(variable) {
	"use strict";

	return 'object' === typeof variable
		&& null !== variable
		&& false === Array.isArray(variable);
};