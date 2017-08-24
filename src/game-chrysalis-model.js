/*global shuffle*/
/*jslint for*/

/**
 * Modèle pour le jeu des crysalides.
 *
 * @constructor
 */
var GameChrysalisModel = function() {
	"use strict";

	return undefined;
};

/**
 *
 * @param {Integer} columns
 * @param {Integer} balance
 * @param {Integer} i
 * @returns {Boolean}
 */
GameChrysalisModel.prototype.extra = function(columns, balance, i) {
	"use strict";

	var limitLeft = Math.floor(columns/2),limitRight = Math.ceil(columns/2), addLeft, addRight;

	addLeft = (-1 === balance && i%columns < limitLeft);
	addRight = (1 === balance && i%columns > limitRight);

	return addLeft || addRight;
};

/**
 *
 * @param {Integer} columns
 * @param {Integer} rows
 * @param {Integer} targets
 * @param {Integer} balance
 * @returns {Array}
 */
GameChrysalisModel.prototype.positions = function(columns, rows, targets, balance) {
	"use strict";

	var positions = [], i;
	balance = parseInt(balance, 10);

	for(i = 0;i<columns*rows;i+=1) {
		positions.push(i);
		if(true === this.extra(columns, balance, i)) {
			positions.push(i);
		}
	}

	shuffle(positions);
	return positions.slice(0, targets);
};