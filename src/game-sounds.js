/*global console*/
/*jslint this*/

/**
 * Bibliothèque de sons pour les jeux.
 *
 * @constructor
 * @param {Object} sounds Les sons (clé string, objets Audio)
 * @param {GameStorage} settings L'objet stockant les paramètres de la partie actuelle
 */
var GameSounds = function(sounds, settings) {
	"use strict";

	this.sounds = sounds;
	this.settings = settings;
};

/**
 * Tente de jouer le son demandé si la clé existe et si les sons sont activés dans
 * les paramètres de la partie.
 *
 * @param {String} key La clé à jouer
 * @returns {undefined}
 */
GameSounds.prototype.play = function(key) {
	"use strict";

	if(true === this.settings.read('sound')) {
		try {
			if('undefined' !== typeof this.sounds[key]) {
				this.sounds[key].play();
			} else {
				console.log('Le son ' + key + ' n\'a pas été trouvé dans la liste.');
			}
		} catch (e) {
			console.log(e);
		}
	}
};