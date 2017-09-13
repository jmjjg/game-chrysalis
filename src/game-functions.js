/*global $, Array, Blob, Math, String, window*/
/*jslint for*/

/**
 * Retourne une copie de l'array original randomisé.
 *
 * @param {Array} original L'array original
 * @returns {Array}
 * @see Original: {@link https://stackoverflow.com/a/6274381}
 */
var array_shuffle = function(original) {
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
var is_object = function(variable) {
	"use strict";

	return 'object' === typeof variable
		&& null !== variable
		&& false === Array.isArray(variable);
};

/**
 * Convertit une matrice de valeurs au format CSV.
 *
 * @see {@link https://stackoverflow.com/a/33807762}
 *
 * @param {Array} rows Les rangées, contenant des colonnes, contenant des valeurs
 * @returns {String}
 */
var matrix_to_csv = function (rows) {
	"use strict";

    var // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = String.fromCharCode(11), // vertical tab character
    tmpRowDelim = String.fromCharCode(0), // null character

    // actual delimiter characters for CSV format
    colDelim = '","',
    rowDelim = '"\r\n"',

    // Grab text from table into CSV formatted string
    csv = '"' + rows.map(function (cols) {
        return cols.map(function (col) {
            return 'undefined' === typeof col
				? ''
				: col.toString().replace(/"/g, '""'); // escape double quotes
        }).join(tmpColDelim);

    }).join(tmpRowDelim)
    .split(tmpRowDelim).join(rowDelim)
    .split(tmpColDelim).join(colDelim) + '"';

	return csv;
};