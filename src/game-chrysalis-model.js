/*global shuffle*/
/*jslint for*/

/**
 * Modèle de jeu pour le jeu des crysalides.
 *
 * @constructor
 */
var GameChrysalisModel = function() {
	"use strict";

	return undefined;
};

/**
 * Vérifie s'il faut ajouter l'index dans les positions afin d'avoir plus de
 * probabilités de l'obtenir, en fonction du nombre de colonnes et l'équilibre.
 *
 * @param {Integer} i l'index dans la matrice
 * @param {Integer} columns Le nombre de colonnes dans la matrice
 * @param {Integer} balance L'équilibre: -1 pour la gauche, 1 pour la droite, 0
 *	pour le centre
 * @returns {Boolean}
 */
GameChrysalisModel.prototype.extra = function(i, columns, balance) {
	"use strict";

	var limitLeft = Math.floor(columns/2),limitRight = Math.ceil(columns/2), addLeft, addRight;

	addLeft = (-1 === balance && i%columns < limitLeft);
	addRight = (1 === balance && i%columns > limitRight);

	return addLeft || addRight;
};

/**
 * Retourne les nombre de positions demandé pris au hasard en fonction du nombre
 * de colonnes, de rangées et de l'équilibre.
 *
 * @param {Integer} columns Le nombre de colonnes
 * @param {Integer} rows Le nombre de rangées
 * @param {Integer} targets Le nombre de positions demandé
 * @param {Integer} balance L'équilibre: -1 pour la gauche, 1 pour la droite, 0
 *	pour le centre
 * @returns {Array}
 */
GameChrysalisModel.prototype.positions = function(columns, rows, targets, balance) {
	"use strict";

	var positions = [], i;
	balance = parseInt(balance, 10);

	for(i = 0;i<columns*rows;i+=1) {
		positions.push(i);
		if(true === this.extra(i, columns, balance)) {
			positions.push(i);
		}
	}

	shuffle(positions);
	return positions.slice(0, targets);
};